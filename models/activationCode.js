import crypto from "node:crypto";
import database from "infra/database.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "infra/errors.js";

const MAX_DEVICES_PER_CODE = 2;

// Letras e números sem confusão visual ou auditiva: sem 0, O, 1, I.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

// Mapeamento dos tabuleiros da loja para suas respectivas cidades/cores.
const BOARD_CONFIG = {
  "tabuleiro-vermelho": { board: "vermelho" },
  "tabuleiro-amarelo": { board: "amarelo" },
  "tabuleiro-verde": { board: "verde" },
  "tabuleiro-azul": { board: "azul" },
};

// Gera código opaco no formato XXXX-XXXX (8 caracteres, > 1 trilhão de combinações).
// Não contém sequência, não contém data e não denota quantidade de base instalada nem estado.
function newCodeString() {
  let part1 = "";
  let part2 = "";

  for (let i = 0; i < 4; i += 1) {
    part1 += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
    part2 += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  }

  return `${part1}-${part2}`;
}

async function createForOrder(orderId, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const codesToInsert = [];

  for (const item of items) {
    const config = BOARD_CONFIG[item.slug];
    if (!config) {
      continue;
    }

    const quantity =
      Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;

    for (let q = 0; q < quantity; q += 1) {
      codesToInsert.push({
        id: crypto.randomUUID(),
        code: newCodeString(),
        board: config.board,
        orderId,
      });
    }
  }

  if (codesToInsert.length === 0) {
    return [];
  }

  const createdCodes = [];

  for (const item of codesToInsert) {
    const result = await database.query({
      text: `
        INSERT INTO
          activation_codes (id, code, board, order_id)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          id, code, board, order_id, created_at
      ;`,
      values: [item.id, item.code, item.board, item.orderId],
    });
    createdCodes.push(result.rows[0]);
  }

  return createdCodes;
}

async function findAllByOrderId(orderId) {
  const result = await database.query({
    text: `
      SELECT
        ac.id,
        ac.code,
        ac.board,
        ac.order_id,
        ac.created_at,
        count(acd.id)::int AS devices_count
      FROM
        activation_codes ac
      LEFT JOIN
        activation_code_devices acd ON acd.code_id = ac.id
      WHERE
        ac.order_id = $1
      GROUP BY
        ac.id
      ORDER BY
        ac.created_at ASC
    ;`,
    values: [orderId],
  });

  return result.rows;
}

async function findAllByOrderIds(orderIds) {
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return [];
  }

  const result = await database.query({
    text: `
      SELECT
        ac.id,
        ac.code,
        ac.board,
        ac.order_id,
        ac.created_at,
        count(acd.id)::int AS devices_count
      FROM
        activation_codes ac
      LEFT JOIN
        activation_code_devices acd ON acd.code_id = ac.id
      WHERE
        ac.order_id = ANY($1::uuid[])
      GROUP BY
        ac.id
      ORDER BY
        ac.created_at ASC
    ;`,
    values: [orderIds],
  });

  return result.rows;
}

async function findAllByCustomerEmail(email) {
  if (typeof email !== "string" || !email.trim()) {
    return [];
  }

  const result = await database.query({
    text: `
      SELECT
        ac.id,
        ac.code,
        ac.board,
        ac.order_id,
        ac.created_at,
        o.code AS order_code,
        o.status AS order_status,
        count(acd.id)::int AS devices_count
      FROM
        activation_codes ac
      INNER JOIN
        orders o ON o.id = ac.order_id
      LEFT JOIN
        activation_code_devices acd ON acd.code_id = ac.id
      WHERE
        LOWER(o.customer_email) = LOWER($1)
        AND o.status = 'paid'
      GROUP BY
        ac.id, o.code, o.status
      ORDER BY
        ac.created_at DESC
    ;`,
    values: [email.trim()],
  });

  return result.rows;
}

async function activate({ code, deviceId, userId = null }) {
  const rawCode = typeof code === "string" ? code.trim().toUpperCase() : "";
  const cleanDeviceId = typeof deviceId === "string" ? deviceId.trim() : "";

  // Aceita com ou sem hífen (ex: 7K9X-M2P4 ou 7K9XM2P4)
  let cleanCode = rawCode;
  if (/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(rawCode)) {
    cleanCode = `${rawCode.slice(0, 4)}-${rawCode.slice(4)}`;
  }

  if (!cleanCode) {
    throw new ValidationError({
      message: "O código de ativação é obrigatório.",
      action: "Digite o código que veio no cartão do seu tabuleiro.",
    });
  }

  if (!cleanDeviceId) {
    throw new ValidationError({
      message: "O identificador do aparelho é obrigatório.",
      action: "Abra o aplicativo no seu celular ou tablet para ativar.",
    });
  }

  const codeResult = await database.query({
    text: `
      SELECT
        *
      FROM
        activation_codes
      WHERE
        code = $1
      LIMIT
        1
    ;`,
    values: [cleanCode],
  });

  if (codeResult.rowCount === 0) {
    throw new NotFoundError({
      message: "Código de ativação não encontrado.",
      action:
        "Confira se digitou exatamente como impresso no cartão da sacola.",
    });
  }

  const activationCode = codeResult.rows[0];

  const devicesResult = await database.query({
    text: `
      SELECT
        id, device_id, created_at
      FROM
        activation_code_devices
      WHERE
        code_id = $1
      ORDER BY
        created_at ASC
    ;`,
    values: [activationCode.id],
  });

  const registeredDevices = devicesResult.rows;
  const alreadyActive = registeredDevices.some(
    (device) => device.device_id === cleanDeviceId,
  );

  if (alreadyActive) {
    return {
      success: true,
      board: activationCode.board,
      code: activationCode.code,
      alreadyActive: true,
      devicesCount: registeredDevices.length,
      maxDevices: MAX_DEVICES_PER_CODE,
    };
  }

  if (registeredDevices.length >= MAX_DEVICES_PER_CODE) {
    throw new ForbiddenError({
      message: "Este código já atingiu o limite de 2 aparelhos cadastrados.",
      action:
        "O tabuleiro só pode ser jogado nos 2 primeiros aparelhos que usaram este código.",
    });
  }

  await database.query({
    text: `
      INSERT INTO
        activation_code_devices (id, code_id, device_id, user_id)
      VALUES
        ($1, $2, $3, $4)
    ;`,
    values: [crypto.randomUUID(), activationCode.id, cleanDeviceId, userId],
  });

  return {
    success: true,
    board: activationCode.board,
    code: activationCode.code,
    alreadyActive: false,
    devicesCount: registeredDevices.length + 1,
    maxDevices: MAX_DEVICES_PER_CODE,
  };
}

async function findActiveBoardsByDevice(deviceId) {
  const cleanDeviceId = typeof deviceId === "string" ? deviceId.trim() : "";

  if (!cleanDeviceId) {
    return [];
  }

  const result = await database.query({
    text: `
      SELECT DISTINCT
        ac.board
      FROM
        activation_codes ac
      INNER JOIN
        activation_code_devices acd ON acd.code_id = ac.id
      WHERE
        acd.device_id = $1
      ORDER BY
        ac.board ASC
    ;`,
    values: [cleanDeviceId],
  });

  return result.rows.map((row) => row.board);
}

const activationCode = {
  BOARD_CONFIG,
  MAX_DEVICES_PER_CODE,
  createForOrder,
  findAllByOrderId,
  findAllByOrderIds,
  findAllByCustomerEmail,
  activate,
  findActiveBoardsByDevice,
};

export default activationCode;
