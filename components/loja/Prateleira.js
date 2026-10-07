import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import CartaoDoProduto from "components/loja/CartaoDoProduto.js";

// Uma prateleira da loja: título, uma linha de texto e os produtos em cartões
// iguais, tabuleiros e kits juntos. Na home ela mostra o catálogo inteiro; na
// página de um produto, mostra os outros. Em /loja o título da página já é
// "Loja", então o daqui vai `oculto`, só para o leitor de tela.
//
// `naDobra` é para a prateleira que aparece logo que a página abre, na home e
// em /loja: as fotos da primeira fileira carregam junto com a página. Sem
// isso a maior imagem da tela chegava atrasada, e o Next avisa no console.
const PRIMEIRA_FILEIRA = 3;

function Prateleira({
  id,
  titulo,
  texto,
  produtos,
  oculto = false,
  naDobra = false,
}) {
  const temIlustrativa = produtos.some(
    (produto) => produto.fotos[0].ilustrativa,
  );

  return (
    <section className={estilos.prateleiraSecao} id={id}>
      <div className={landing.container}>
        {oculto ? (
          <h2 className={estilos.somenteLeitor}>{titulo}</h2>
        ) : (
          <div className={estilos.prateleiraCabeca}>
            <h2 className={estilos.prateleiraTitulo}>{titulo}</h2>
            {texto && <p className={landing.corpo}>{texto}</p>}
          </div>
        )}

        <ul className={estilos.prateleira}>
          {produtos.map((produto, posicao) => (
            <li key={produto.slug}>
              <CartaoDoProduto
                produto={produto}
                adiantado={naDobra && posicao < PRIMEIRA_FILEIRA}
              />
            </li>
          ))}
        </ul>

        {temIlustrativa && (
          <p className={`${estilos.prateleiraNota} ${landing.dado}`}>
            Algumas imagens são ilustrativas: as fotos desses produtos ainda vão
            chegar.
          </p>
        )}
      </div>
    </section>
  );
}

export default Prateleira;
