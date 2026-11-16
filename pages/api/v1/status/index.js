import { createRouter } from "next-connect";
import database from "infra/database";
import controller from "infra/controller.js";
import authorization from "models/authorization.js";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .get(getHandler)
  .handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userTryingToGet = request.context.user;
  const updatedAt = new Date().toISOString();

  // Uma consulta e uma conexão para obter o mesmo retrato do banco.
  const databaseResult = await database.query({
    text: `
      SELECT
        current_setting('server_version') AS version,
        current_setting('max_connections')::int AS max_connections,
        count(*)::int AS opened_connections
      FROM pg_stat_activity
      WHERE datname = $1
    ;`,
    values: [process.env.POSTGRES_DB],
  });

  const statusObject = {
    updated_at: updatedAt,
    dependencies: {
      database: databaseResult.rows[0],
    },
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToGet,
    "read:status",
    statusObject,
  );

  return response.status(200).json(secureOutputValues);
}
