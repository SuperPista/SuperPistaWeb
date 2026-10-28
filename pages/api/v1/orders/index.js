import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authorization from "models/authorization.js";
import order from "models/order.js";
import payment from "models/payment.js";

// A compra não pede conta, então o POST não olha a sessão: quem tem a sacola
// e os dados de entrega faz o pedido. A sessão é lida só no GET, a lista de
// vendas. No POST, um cookie de sessão vencido responderia 401 e barraria a
// compra de quem nem precisava estar logado.
export default createRouter()
  .get(
    controller.injectAnonymousOrUser,
    controller.canRequest("read:order:all"),
    getHandler,
  )
  .post(postHandler)
  .handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const orders = await order.findAll();

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:order:all",
    orders,
  );

  return response.status(200).json(secureOutputValues);
}

// O pagamento é aberto antes de gravar: se a AbacatePay falhar, nenhum pedido
// fica no banco sem ter como ser pago.
async function postHandler(request, response) {
  const prepared = order.prepare(request.body);
  const checkout = await payment.openCheckout(prepared);
  const createdOrder = await order.create(prepared, checkout);

  return response.status(201).json(order.toPublic(createdOrder));
}
