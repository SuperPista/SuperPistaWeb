import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import activationCode from "models/activationCode.js";

export default createRouter().get(getHandler).handler(controller.errorHandlers);

async function getHandler(request, response) {
  const deviceId = request.query.device_id;
  const boards = await activationCode.findActiveBoardsByDevice(deviceId);

  return response.status(200).json({
    success: true,
    device_id: deviceId || null,
    boards,
  });
}
