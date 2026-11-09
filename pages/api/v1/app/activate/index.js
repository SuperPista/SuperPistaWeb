import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import activationCode from "models/activationCode.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .post(postHandler)
  .handler(controller.errorHandlers);

async function postHandler(request, response) {
  const user = request.context?.user;
  const userId = user?.id || null;
  const { code, device_id } = request.body || {};

  const result = await activationCode.activate({
    code,
    deviceId: device_id,
    userId,
  });

  return response.status(200).json(result);
}
