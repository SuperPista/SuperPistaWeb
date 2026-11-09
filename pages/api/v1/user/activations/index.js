import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import activationCode from "models/activationCode.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .get(controller.canRequest("read:user:self"), getHandler)
  .handler(controller.errorHandlers);

async function getHandler(request, response) {
  const user = request.context.user;
  const activations = await activationCode.findAllByCustomerEmail(user.email);

  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  return response.status(200).json(activations);
}
