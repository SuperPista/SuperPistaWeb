// Conversa com a API da conta e sempre devolve { ok, status, corpo }, sem
// lançar: cada tela decide o que mostrar. Quando a resposta não traz uma
// mensagem própria, `corpo` ganha uma no mesmo formato da API.
const SEM_CONEXAO = {
  message: "Não foi possível falar com o site.",
  action: "Confira sua conexão com a internet e tente de novo.",
};

const ERRO_NOSSO = {
  message: "Algo deu errado do nosso lado.",
  action: "Tente de novo em alguns minutos.",
};

export async function pedir(caminho, { metodo = "GET", corpo } = {}) {
  let resposta;

  try {
    resposta = await fetch(caminho, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    return { ok: false, status: 0, corpo: SEM_CONEXAO };
  }

  let corpoDaResposta = {};
  try {
    corpoDaResposta = await resposta.json();
  } catch {
    // 204 e respostas sem JSON chegam aqui; o status já diz o que importa.
  }

  if (!resposta.ok && !corpoDaResposta.message) {
    corpoDaResposta = ERRO_NOSSO;
  }

  return { ok: resposta.ok, status: resposta.status, corpo: corpoDaResposta };
}
