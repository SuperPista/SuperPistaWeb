import abacatepay from "infra/abacatepay.js";
import webserver from "infra/webserver.js";
import { ServiceError } from "infra/errors.js";
import order from "models/order.js";
import { produtoPorSlug } from "components/loja/catalogo.js";
import { formatarCelular, formatarCpf } from "components/loja/campos.js";
import { linkDoPedido } from "components/loja/links.js";

// O pagamento acontece no checkout hospedado da AbacatePay: o site cria a
// cobrança, a pessoa paga na página dela e volta para a página do pedido. A
// confirmação chega pelo webhook e, como reforço, pela consulta que a página
// do pedido faz enquanto falta pagar.

const METHODS = ["PIX", "CARD", "BOLETO"];

// A AbacatePay parcela em até 12x, com no mínimo R$ 10,00 por parcela.
const MAX_INSTALLMENTS = 12;
const MIN_INSTALLMENT = 1000;

// Situação do checkout na AbacatePay → situação do pedido. PENDING não muda
// nada. REDEEMED (cupom de 100%) também não: a loja não oferece cupom, então
// um checkout fechado sem pagar não pode virar pedido pago.
const STATUS_FROM_CHECKOUT = {
  PAID: "paid",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

const STATUS_FROM_EVENT = {
  "checkout.completed": "paid",
  "checkout.refunded": "refunded",
};

function maxInstallments(total) {
  return Math.max(
    1,
    Math.min(MAX_INSTALLMENTS, Math.floor(total / MIN_INSTALLMENT)),
  );
}

// Cada produto à venda é cadastrado à mão no painel da AbacatePay, e o id de
// lá muda entre o Dev mode e a produção. Por isso ele vem do ambiente, numa
// variável com o nome do produto: ABACATEPAY_PRODUCT_TABULEIRO_VERMELHO.
function productIdVariable(produto) {
  return `ABACATEPAY_PRODUCT_${produto.slug.toUpperCase().replaceAll("-", "_")}`;
}

// id do produto na AbacatePay → preço já conferido, para não perguntar de novo
// a cada pedido. Vale enquanto a instância do servidor estiver de pé.
const checkedPrices = new Map();

// O preço que vale é o do catálogo do site, mas a AbacatePay cobra o do
// produto dela. Se os dois não baterem, o pedido é recusado: a pessoa pagaria
// um valor diferente do que viu.
async function productIdFor(produto) {
  const variable = productIdVariable(produto);
  const id = process.env[variable];

  if (!id) {
    throw new ServiceError({
      message: "O produto da loja não está ligado a um produto da AbacatePay.",
      action: `Defina ${variable} no ambiente.`,
      context: { slug: produto.slug },
    });
  }

  if (checkedPrices.get(id) === produto.preco) {
    return id;
  }

  const product = await abacatepay.getProduct(id);

  if (!product) {
    throw new ServiceError({
      message: "O produto não existe na AbacatePay.",
      action: `Confira ${variable}: o id é o do painel, no mesmo modo da chave.`,
      context: { id },
    });
  }

  if (product.price !== produto.preco) {
    throw new ServiceError({
      message: "O preço do produto na AbacatePay não confere com o da loja.",
      action: `Confira o produto ${id} no painel da AbacatePay.`,
      context: { id, price: product.price, expected: produto.preco },
    });
  }

  checkedPrices.set(id, produto.preco);
  return id;
}

// Com o cliente cadastrado, o checkout da AbacatePay já abre com os dados que
// a pessoa digitou no site, e ela não precisa digitar tudo de novo. O endereço
// não vai: a etapa de endereço sai do checkout (paymentUrlFor), e a entrega
// usa o que fica gravado no pedido.
function customerFor(prepared) {
  const { customer } = prepared;

  return {
    email: customer.email,
    name: customer.name,
    cellphone: formatarCelular(customer.phone),
    taxId: formatarCpf(customer.tax_id),
  };
}

// O endereço de entrega já foi digitado no site, mas o checkout da AbacatePay
// pede um de novo quando aceita cartão. A flag na URL tira essa etapa: PIX e
// boleto não usam endereço, e no cartão a cobrança sai sem ele.
function paymentUrlFor(checkoutUrl) {
  const url = new URL(checkoutUrl);
  url.searchParams.set("skip_address", "true");
  return url.toString();
}

// Abre a cobrança de um pedido preparado (order.prepare). Dois tabuleiros com
// nomes diferentes são o mesmo produto para a AbacatePay: o nome de cada peça
// fica só no pedido.
async function openCheckout(prepared) {
  const quantities = new Map();

  for (const item of prepared.items) {
    quantities.set(item.slug, (quantities.get(item.slug) || 0) + item.quantity);
  }

  const items = await Promise.all(
    [...quantities].map(async ([slug, quantity]) => ({
      id: await productIdFor(produtoPorSlug(slug)),
      quantity,
    })),
  );

  const customer = await abacatepay.createCustomer(customerFor(prepared));
  const orderUrl = `${webserver.origin}${linkDoPedido(prepared.id)}`;

  const checkout = await abacatepay.createCheckout({
    items,
    customerId: customer.id,
    externalId: prepared.id,
    returnUrl: orderUrl,
    completionUrl: orderUrl,
    methods: METHODS,
    card: { maxInstallments: maxInstallments(prepared.total) },
    metadata: { pedido: prepared.code },
  });

  // A AbacatePay soma o total a partir dos produtos dela. Se a soma não bater
  // com a do site, a pessoa pagaria um valor diferente do que viu.
  if (checkout.amount !== prepared.total) {
    throw new ServiceError({
      message: "O valor da cobrança não confere com o total do pedido.",
      action: "Confira os produtos da loja no painel da AbacatePay.",
      context: { expected: prepared.total, received: checkout.amount },
    });
  }

  return {
    id: checkout.id,
    url: paymentUrlFor(checkout.url),
    devMode: checkout.devMode,
  };
}

// Pergunta à AbacatePay como está o pagamento de um pedido que ainda espera
// por ele. O webhook não chega ao localhost e pode atrasar, então a página do
// pedido não depende só dele. Uma falha aqui não impede de mostrar o pedido.
async function refresh(pendingOrder) {
  if (pendingOrder.status !== "pending") {
    return pendingOrder;
  }

  try {
    const checkout = await abacatepay.getCheckout(
      pendingOrder.abacatepay_checkout_id,
    );
    const status = STATUS_FROM_CHECKOUT[checkout?.status];

    if (!status) {
      return pendingOrder;
    }

    return (
      (await order.transitionByCheckoutId(
        pendingOrder.abacatepay_checkout_id,
        status,
      )) || (await order.findOneById(pendingOrder.id))
    );
  } catch (error) {
    console.error({
      name: "PaymentRefreshError",
      underlyingErrorName: error?.name,
    });
    return pendingOrder;
  }
}

// Trata um evento do webhook, já autenticado. Evento de outro tipo, ou de um
// checkout que não é de pedido nenhum, termina sem erro: responder com erro só
// faria a AbacatePay tentar de novo por horas. Eventos repetidos não mudam
// nada duas vezes, porque order.transitionByCheckoutId só anda para frente.
async function handleWebhookEvent(event) {
  const status = STATUS_FROM_EVENT[event?.event];
  const checkout = event?.data?.checkout;

  if (!status || typeof checkout?.id !== "string") {
    return;
  }

  if (status === "paid" && checkout.status !== "PAID") {
    return;
  }

  await order.transitionByCheckoutId(checkout.id, status);
}

const payment = {
  openCheckout,
  refresh,
  handleWebhookEvent,
  maxInstallments,
  productIdVariable,
};

export default payment;
