import useSWR from "swr";
import { pedir } from "components/conta/pedir.js";
import { vendaDaApi } from "components/vendas/vendas.js";

// A conta sem a permissão de ver as vendas recebe 403 e volta null, para a
// página explicar isso em vez de mostrar um erro. Qualquer outra falha vira
// erro do SWR, que guarda a lista que já tinha chegado.
async function buscarVendas(caminho) {
  const resposta = await pedir(caminho);

  if (resposta.status === 403) {
    return null;
  }

  if (!resposta.ok) {
    throw resposta.corpo;
  }

  return resposta.corpo.map(vendaDaApi);
}

// A lista de vendas, lida de GET /api/v1/orders. Sem `ligado` (a conta ainda
// não chegou), espera.
function useVendas(ligado) {
  const { data, error } = useSWR(
    ligado ? "/api/v1/orders" : null,
    buscarVendas,
  );

  return {
    vendas: data ?? null,
    semPermissao: data === null,
    erro: data === undefined ? error : undefined,
    carregando: data === undefined && !error,
  };
}

export default useVendas;
