import crypto from "node:crypto";
import database from "infra/database.js";
import emailValidation from "infra/emailValidation.js";
import { NotFoundError, ValidationError } from "infra/errors.js";
import { produtoPorSlug } from "components/loja/catalogo.js";
import { LIMITE_POR_LINHA, resumirSacola } from "components/loja/sacola.js";
import { conferirDados, formatarCep } from "components/loja/campos.js";
import { ARTIGOS, nomeImprimivel } from "components/nome/regras.js";

// O pedido usa o mesmo catálogo, as mesmas contas e as mesmas conferências
// que as telas da loja (components/loja e components/nome), para o servidor e
// o navegador nunca discordarem do total. A diferença é que aqui o preço que
// vale é o do catálogo, não o que o navegador mandou: ele nem manda preço.

// Para onde o pedido pode ir a partir de cada situação. Pagamento que chega
// depois do prazo ainda conta: o dinheiro entrou.
const TRANSITIONS = {
  paid: ["pending", "expired", "cancelled"],
  refunded: ["paid"],
  expired: ["pending"],
  cancelled: ["pending"],
};

// Bem mais do que uma sacola de verdade tem. Só barra o que não é sacola.
const MAX_LINES = 30;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Letras e números que não se confundem ao ditar por telefone: sem 0, O, 1, I.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function newCode() {
  let code = "";

  for (let i = 0; i < 6; i += 1) {
    code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  }

  return `SP-${code}`;
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function digits(value) {
  return text(value).replace(/\D/g, "");
}

function invalidItems(message, action) {
  return new ValidationError({
    message,
    action: action || "Volte à sacola, confira os itens e tente de novo.",
  });
}

function validateCustomerAndAddress(customer, address) {
  const errors = conferirDados({
    nome: text(customer.name),
    email: text(customer.email),
    celular: text(customer.phone),
    cpf: text(customer.tax_id),
    cep: text(address.zip_code),
    rua: text(address.street),
    numero: text(address.number),
    complemento: text(address.complement),
    bairro: text(address.neighborhood),
    cidade: text(address.city),
    estado: text(address.state),
  });

  const [firstError] = Object.values(errors);

  if (firstError) {
    throw new ValidationError({
      message: firstError,
      action: "Confira os dados de quem recebe e o endereço.",
    });
  }
}

// Cada linha volta no formato da sacola (components/loja/sacola.js), pronta
// para o resumirSacola fazer as contas.
function validateLines(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw invalidItems("O pedido chegou sem nenhum produto.");
  }

  if (items.length > MAX_LINES) {
    throw invalidItems("O pedido tem produtos demais.");
  }

  return items.map((item) => {
    const produto = produtoPorSlug(item?.slug);

    if (!produto) {
      throw invalidItems("Um dos produtos da sacola não está mais na loja.");
    }

    if (produto.emBreve) {
      throw invalidItems("Um dos produtos da sacola ainda não está à venda.");
    }

    const quantity = item.quantity;

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > LIMITE_POR_LINHA
    ) {
      throw invalidItems(
        "A quantidade de um dos produtos não vale.",
        `Cada linha da sacola vai de 1 a ${LIMITE_POR_LINHA} unidades.`,
      );
    }

    const childName = text(item.child_name);

    if (childName === "") {
      return { slug: produto.slug, quantidade: quantity, nome: "", artigo: "" };
    }

    if (
      !produto.aceitaNome ||
      !nomeImprimivel(childName) ||
      !ARTIGOS.includes(item.article)
    ) {
      throw invalidItems(
        "O nome da criança de um dos produtos não sai na peça.",
      );
    }

    return {
      slug: produto.slug,
      quantidade: quantity,
      nome: childName,
      artigo: item.article,
    };
  });
}

// Confere o que veio do checkout e monta o pedido, ainda sem gravar: o
// pagamento é aberto antes, porque o pedido só existe com ele.
function prepare(input) {
  const customer = input?.customer || {};
  const address = input?.shipping_address || {};

  validateCustomerAndAddress(customer, address);
  const summary = resumirSacola(validateLines(input?.items));

  return {
    id: crypto.randomUUID(),
    code: newCode(),
    items: summary.itens.map((item) => ({
      slug: item.slug,
      product_name: item.produto.nome,
      child_name: item.nome,
      article: item.artigo,
      quantity: item.quantidade,
      unit_price: item.produto.preco,
      amount: item.valor,
    })),
    subtotal: summary.subtotal,
    shipping: summary.frete,
    total: summary.total,
    customer: {
      name: text(customer.name).replace(/\s+/g, " "),
      email: emailValidation.validateFormat(customer.email),
      phone: digits(customer.phone),
      tax_id: digits(customer.tax_id),
    },
    shipping_address: {
      zip_code: formatarCep(text(address.zip_code)),
      street: text(address.street),
      number: text(address.number),
      complement: text(address.complement),
      neighborhood: text(address.neighborhood),
      city: text(address.city),
      state: text(address.state),
    },
  };
}

async function create(prepared, checkout) {
  const results = await database.query({
    text: `
      INSERT INTO
        orders (
          id, code, items, subtotal, shipping, total,
          customer_name, customer_email, customer_phone, customer_tax_id,
          shipping_address, abacatepay_checkout_id, payment_url, dev_mode
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING
        *
    ;`,
    values: [
      prepared.id,
      prepared.code,
      JSON.stringify(prepared.items),
      prepared.subtotal,
      prepared.shipping,
      prepared.total,
      prepared.customer.name,
      prepared.customer.email,
      prepared.customer.phone,
      prepared.customer.tax_id,
      JSON.stringify(prepared.shipping_address),
      checkout.id,
      checkout.url,
      checkout.devMode,
    ],
  });

  return results.rows[0];
}

async function findOneById(id) {
  // Um id fora do formato nem vai ao banco: o Postgres recusaria o UUID com
  // um erro, e a resposta certa é a de pedido que não existe.
  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    throwNotFound();
  }

  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        orders
      WHERE
        id = $1
      LIMIT
        1
    ;`,
    values: [id],
  });

  if (results.rowCount === 0) {
    throwNotFound();
  }

  return results.rows[0];

  function throwNotFound() {
    throw new NotFoundError({
      message: "O pedido não foi encontrado.",
      action: "Confira o link do pedido.",
    });
  }
}

// Muda a situação do pedido só se ela permitir (TRANSITIONS). Assim o mesmo
// aviso de pagamento chegando duas vezes, ou fora de ordem, não estraga nada.
// Devolve o pedido atualizado, ou null quando não havia o que mudar.
//
// O $2 aparece duas vezes, e sem o cast o Postgres deduz um tipo diferente em
// cada uma e recusa a consulta.
async function transitionByCheckoutId(checkoutId, status) {
  const results = await database.query({
    text: `
      UPDATE
        orders
      SET
        status = $2::varchar,
        paid_at = CASE WHEN $2::varchar = 'paid' THEN timezone('utc', now()) ELSE paid_at END,
        updated_at = timezone('utc', now())
      WHERE
        abacatepay_checkout_id = $1
        AND status = ANY($3)
      RETURNING
        *
    ;`,
    values: [checkoutId, status, TRANSITIONS[status]],
  });

  return results.rows[0] || null;
}

// O que a página do pedido mostra. A compra não pede conta, então quem tem o
// link vê o pedido: por isso o id é um UUID, e e-mail, celular e CPF ficam de
// fora. O link de pagamento só aparece enquanto falta pagar.
function toPublic(order) {
  return {
    id: order.id,
    code: order.code,
    status: order.status,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    customer_name: order.customer_name,
    shipping_address: order.shipping_address,
    payment_url: order.status === "pending" ? order.payment_url : null,
    dev_mode: order.dev_mode,
    paid_at: order.paid_at,
    created_at: order.created_at,
  };
}

const order = {
  prepare,
  create,
  findOneById,
  transitionByCheckoutId,
  toPublic,
};

export default order;
