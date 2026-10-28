import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import order from "models/order.js";
import payment from "models/payment.js";

// A compra não pede conta, então a rota não olha a sessão: quem tem a sacola
// e os dados de entrega faz o pedido.
export default createRouter()
  .post(postHandler)
  .handler(controller.errorHandlers);

// O pagamento é aberto antes de gravar: se a AbacatePay falhar, nenhum pedido
// fica no banco sem ter como ser pago.
async function postHandler(request, response) {
  const prepared = order.prepare(request.body);
  const checkout = await payment.openCheckout(prepared);
  const createdOrder = await order.create(prepared, checkout);

  return response.status(201).json(order.toPublic(createdOrder));
}
