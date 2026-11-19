import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/landingPresente/presente.module.css";

function DoisJeitos() {
  return (
    <section className={estilos.secaoClara} id="dois-jeitos">
      <div className={landing.container}>
        <header className={estilos.cabecalhoSecao}>
          <h2 className={landing.h2}>
            Um presente que funciona de dois jeitos
          </h2>
          <p className={landing.lead}>
            Sem brigar com a tela: a criança brinca no chão com os brinquedos
            que já tem e, quando a família quiser, o celular levanta a cidade em
            3D.
          </p>
        </header>

        <div className={estilos.comparativo}>
          <article className={estilos.modo}>
            <div className={estilos.modoTopo}>
              <h3>Sem tela</h3>
              <span className={`${estilos.modoIdade} ${landing.dado}`}>
                A partir de 4 anos
              </span>
            </div>
            <div className={estilos.modoFoto}>
              <Image
                className={estilos.midiaPreencher}
                src="/loja/tabuleiro-vermelho-brinquedos.webp"
                alt="Tabuleiro montado com carrinhos, casinhas e bonecos espalhados pelas ruas."
                fill
                sizes="(min-width: 860px) 540px, 92vw"
              />
            </div>
            <ul className={estilos.modoLista}>
              <li>
                <strong>Resgata os brinquedos da casa:</strong> carrinhos,
                bonecos e blocos ganham ruas, sinalização, escola, hospital e
                estádio.
              </li>
              <li>
                <strong>Chama a família para o chão:</strong> pais, avós, tios e
                amigos montam e inventam histórias juntos.
              </li>
              <li>
                <strong>Feito para durar:</strong> MDF de reflorestamento com
                camada protetora e tinta atóxica que não solta.
              </li>
            </ul>
          </article>

          <article className={estilos.modo}>
            <div className={`${estilos.modoTopo} ${estilos.modoTopoApp}`}>
              <h3>Com o app 3D</h3>
              <span className={`${estilos.modoIdade} ${landing.dado}`}>
                A partir de 6 anos
              </span>
            </div>
            <div className={estilos.modoFoto}>
              <Image
                className={estilos.midiaPreencher}
                src="/loja/tabuleiro-vermelho-3d.webp"
                alt="A cidade do tabuleiro vermelho em 3D com Realidade Aumentada, com prédios, sol e nuvens sobre as ruas."
                fill
                sizes="(min-width: 860px) 540px, 92vw"
              />
            </div>
            <ul className={estilos.modoLista}>
              <li>
                <strong>Realidade Aumentada de verdade:</strong> aponte a câmera
                para a peça 1 e os prédios, semáforos e o estádio sobem em 3D.
              </li>
              <li>
                <strong>Funciona sem internet:</strong> depois de ativar com o
                código do pedido, roda offline em até 2 aparelhos permanentes.
              </li>
              <li>
                <strong>Foto na hora:</strong> um toque no botão da câmera salva
                a cena em 3D para mandar no grupo da família.
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export default DoisJeitos;
