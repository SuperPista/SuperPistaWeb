import useSWR from "swr";
import { pedir } from "components/conta/pedir.js";

// A conta de quem está no site, lida de GET /api/v1/user. Sem sessão a API
// responde 403 e `usuario` fica null. Com um cookie de sessão vencido ela
// responde 401 e apaga o cookie, o que também limpa o caminho para o login.
async function buscarConta(caminho) {
  const resposta = await pedir(caminho);
  return resposta.ok ? resposta.corpo : null;
}

function useConta() {
  const { data, isValidating, mutate } = useSWR("/api/v1/user", buscarConta);

  async function sair() {
    await pedir("/api/v1/sessions", { metodo: "DELETE" });
    await mutate(null, { revalidate: false });
  }

  return {
    usuario: data ?? null,
    // O cache do SWR guarda o "sem conta" da tela anterior. Enquanto a busca
    // nova não volta, a resposta ainda está em aberto, e quem redireciona
    // quem não entrou precisa esperar por ela.
    carregando: data === undefined || (isValidating && !data),
    entrou: Boolean(data),
    recarregar: mutate,
    sair,
  };
}

export default useConta;
