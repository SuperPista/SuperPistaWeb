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

// Quantidades e nomes diferentes da mesma cor compartilham o mesmo direito.
function boardsForItems(items) {
  if (!Array.isArray(items)) return [];
  return [
    ...new Set(
      items.flatMap((item) => {
        const config = BOARD_CONFIG[item?.slug];
        return typeof config?.board === "string" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
          ? [config.board]
          : [];
      }),
    ),
  ];
}

async function createForOrder(orderId, items, client = null) {
  const boards = boardsForItems(items);
  if (boards.length === 0) return [];

  if (!client) {
    return database.transaction((connection) =>
      createForOrder(orderId, items, connection),
    );
  }

  // A trava no pedido evita dois códigos quando duas chamadas se sobrepõem.
  const orderResult = await client.query({
    text: "SELECT id FROM orders WHERE id = $1 FOR UPDATE;",
    values: [orderId],
  });
  if (orderResult.rowCount === 0) {
    throw new NotFoundError({ message: "O pedido não foi encontrado." });
  }

  const existing = await client.query({
    text: "SELECT id, code, board, boards, order_id, created_at FROM activation_codes WHERE order_id = $1 ORDER BY created_at ASC;",
    values: [orderId],
  });
  if (existing.rowCount > 0) return existing.rows;

  // Uma colisão aleatória no texto do código tenta outro sem abortar a transação.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await client.query({
      text: `
        INSERT INTO activation_codes (id, code, board, boards, order_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (code) DO NOTHING
        RETURNING id, code, board, boards, order_id, created_at
      ;`,
      values: [
        crypto.randomUUID(),
        newCodeString(),
        boards[0],
        boards,
        orderId,
      ],
    });
    if (result.rowCount > 0) return result.rows;
  }
  throw new Error("Não foi possível gerar um código de ativação único.");
}

async function findAllByOrderId(orderId) {
  const result = await database.query({
    text: `
      SELECT
        ac.id,
        ac.code,
        ac.board,
        ac.boards,
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
        ac.boards,
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
        ac.boards,
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

  return database.transaction(async (client) => {
    // Serializa as ativações de um código para garantir o limite de aparelhos.
    const codeResult = await client.query({
      text: `
        SELECT ac.*, o.status AS order_status
        FROM activation_codes ac
        LEFT JOIN orders o ON o.id = ac.order_id
        WHERE ac.code = $1
        FOR UPDATE OF ac
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

    const activation = codeResult.rows[0];
    if (activation.order_id && activation.order_status !== "paid") {
      throw new ForbiddenError({
        message: "Este código não tem um pedido com pagamento confirmado.",
        action: "Confira a situação do pagamento na página do pedido.",
      });
    }

    const devicesResult = await client.query({
      text: "SELECT device_id FROM activation_code_devices WHERE code_id = $1;",
      values: [activation.id],
    });
    const alreadyActive = devicesResult.rows.some(
      (device) => device.device_id === cleanDeviceId,
    );

    if (!alreadyActive) {
      if (devicesResult.rowCount >= MAX_DEVICES_PER_CODE) {
        throw new ForbiddenError({
          message:
            "Este código já atingiu o limite de 2 aparelhos cadastrados.",
          action:
            "Os tabuleiros deste código podem ser jogados nos 2 primeiros aparelhos cadastrados.",
        });
      }
      await client.query({
        text: `INSERT INTO activation_code_devices (id, code_id, device_id, user_id)
               VALUES ($1, $2, $3, $4);`,
        values: [crypto.randomUUID(), activation.id, cleanDeviceId, userId],
      });
    }

    return {
      success: true,
      // Mantido para versões antigas do app; boards é a lista completa.
      board: activation.board,
      boards: activation.boards,
      code: activation.code,
      alreadyActive,
      devicesCount: devicesResult.rowCount + (alreadyActive ? 0 : 1),
      maxDevices: MAX_DEVICES_PER_CODE,
    };
  });
}

async function findActiveBoardsByDevice(deviceId) {
  const cleanDeviceId = typeof deviceId === "string" ? deviceId.trim() : "";

  if (!cleanDeviceId) {
    return [];
  }

  const result = await database.query({
    text: `
      SELECT DISTINCT
        unlocked.board
      FROM
        activation_codes ac
      INNER JOIN
        activation_code_devices acd ON acd.code_id = ac.id
      CROSS JOIN LATERAL unnest(ac.boards) AS unlocked(board)
      LEFT JOIN orders o ON o.id = ac.order_id
      WHERE
        acd.device_id = $1
        AND (ac.order_id IS NULL OR o.status = 'paid')
      ORDER BY
        unlocked.board ASC
    ;`,
    values: [cleanDeviceId],
  });

  return result.rows.map((row) => row.board);
}

const activationCode = {
  BOARD_CONFIG,
  MAX_DEVICES_PER_CODE,
  boardsForItems,
  createForOrder,
  findAllByOrderId,
  findAllByOrderIds,
  findAllByCustomerEmail,
  activate,
  findActiveBoardsByDevice,
};

export default activationCode;
