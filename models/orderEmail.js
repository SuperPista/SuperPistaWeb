import database from "infra/database.js";
import email from "infra/email.js";
import webserver from "infra/webserver.js";
import { linkDoPedido } from "components/loja/links.js";
import { tabuleirosDoCodigo } from "components/loja/tabuleirosDoCodigo.js";

// O pagamento já foi gravado antes de tentar enviar. A trava serializa webhook,
// consulta do pedido e estorno; só marca o envio depois de o SMTP aceitar.
async function sendActivationCodes(checkoutId) {
  return database.transaction(async (client) => {
    const result = await client.query({
      text: `
        SELECT id, code, customer_name, customer_email
        FROM orders
        WHERE abacatepay_checkout_id = $1
          AND status = 'paid'
          AND activation_email_sent_at IS NULL
        FOR UPDATE
      ;`,
      values: [checkoutId],
    });
    const paidOrder = result.rows[0];
    if (!paidOrder) return false;

    const codes = await client.query({
      text: `
        SELECT code, board, boards
        FROM activation_codes
        WHERE order_id = $1
        ORDER BY created_at ASC, id ASC
      ;`,
      values: [paidOrder.id],
    });
    // Pedidos só com kits não incluem acesso ao aplicativo.
    if (codes.rowCount === 0) return false;

    const access = codes.rows
      .map((item) => `Código: ${item.code}\n${tabuleirosDoCodigo(item)}`)
      .join("\n\n");

    await email.send({
      from: "Super Pista <contato@superpista.com>",
      to: paidOrder.customer_email,
      subject: `Seu acesso ao aplicativo Super Pista — pedido ${paidOrder.code}`,
      messageId: `<ativacao.${paidOrder.id}@superpista.com>`,
      text: `Olá, ${paidOrder.customer_name}!

O pagamento do seu pedido ${paidOrder.code} foi confirmado. Aqui está o acesso ao aplicativo Super Pista:

${access}

Como ativar:
1. Baixe o aplicativo Super Pista na Play Store ou na App Store.
2. Entre com sua conta. Se ainda não tiver uma, cadastre-se em ${webserver.origin}/cadastro usando o mesmo e-mail da compra e confirme seu cadastro pelo link recebido.
3. No aplicativo, digite o código de ativação. Cada código libera os tabuleiros indicados em até 2 aparelhos.

Você também encontra o código em Minha conta e na página do pedido:
${webserver.origin}${linkDoPedido(paidOrder.id)}

Guarde este e-mail e não compartilhe seu código com terceiros.
Se perder ou trocar de aparelho, solicite um novo acesso pelo e-mail contato@superpista.com, informando o número do pedido ou o código de ativação.

Atenciosamente,
Equipe Super Pista`,
    });

    await client.query({
      text: `UPDATE orders SET activation_email_sent_at = NOW() WHERE id = $1;`,
      values: [paidOrder.id],
    });
    return true;
  });
}

const orderEmail = { sendActivationCodes };

export default orderEmail;
