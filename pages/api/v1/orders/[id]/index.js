import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import order from "models/order.js";
import payment from "models/payment.js";

// O pedido é lido por quem tem o link, sem conta (models/order.js, toPublic).
export default createRouter().get(getHandler).handler(controller.errorHandlers);

async function getHandler(request, response) {
  const foundOrder = await order.findOneById(request.query.id);
  const currentOrder = await payment.refresh(foundOrder);

  return response.status(200).json(order.toPublic(currentOrder));
}
