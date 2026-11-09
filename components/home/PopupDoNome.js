import { useId, useRef } from "react";
import Link from "next/link";
import landing from "components/landing/landing.module.css";
import estilos from "components/home/home.module.css";
import CampoDoNome from "components/nome/CampoDoNome.js";
import Medalhao from "components/nome/Medalhao.js";
import useNomeDaCrianca from "components/nome/useNomeDaCrianca.js";
import { SLUG_DO_TABULEIRO } from "components/loja/catalogo.js";
import { linkDoProduto } from "components/loja/links.js";

// A mesma prévia do nome da landing, aberta num popup sem sair da home. O
// <dialog> nativo já prende o foco, fecha com Esc e deixa o resto da página
// inerte enquanto está aberto. O nome escrito aqui segue para a página do
// tabuleiro, que é para onde o botão leva.
function PopupDoNome() {
  const dialogo = useRef(null);
  const idTitulo = useId();
  const { nome, artigo, mudarNome, escolherArtigo } = useNomeDaCrianca();
  const nomeEscrito =
    nome && nome[0].toUpperCase() + nome.slice(1).toLowerCase();

  function abrir() {
    dialogo.current.showModal();
  }

  function fechar() {
    dialogo.current.close();
  }

  // o painel ocupa o dialog inteiro, então um clique no próprio dialog só pode
  // ter vindo do fundo escurecido em volta
  function aoClicarNoFundo(evento) {
    if (evento.target === dialogo.current) {
      fechar();
    }
  }

  return (
    <>
      <button
        type="button"
        className={`${landing.botao} ${estilos.botaoEscuro}`}
        aria-haspopup="dialog"
        onClick={abrir}
      >
        Ver como fica o nome
      </button>

      <dialog
        ref={dialogo}
        className={estilos.popup}
        aria-labelledby={idTitulo}
        onClick={aoClicarNoFundo}
      >
        <div className={`${landing.escuro} ${estilos.popupPainel}`}>
          <button
            type="button"
            className={estilos.popupFechar}
            aria-label="Fechar"
            onClick={fechar}
          >
            <span aria-hidden="true">×</span>
          </button>

          <div>
            <h2
              id={idTitulo}
              className={`${landing.h2} ${estilos.popupTitulo}`}
            >
              Veja como fica o nome
            </h2>
            <p className={`${landing.corpo} ${estilos.popupCorpo}`}>
              Escreva o nome ou apelido da criança para ver como ele sai no
              círculo amarelo da peça.
            </p>
            <CampoDoNome
              nome={nome}
              artigo={artigo}
              aoMudar={mudarNome}
              aoEscolherArtigo={escolherArtigo}
            />
            <div className={landing.chamada}>
              <Link
                className={landing.botao}
                href={linkDoProduto(SLUG_DO_TABULEIRO)}
              >
                {nomeEscrito
                  ? `Quero o nome ${nomeEscrito} no tabuleiro`
                  : "Ver o tabuleiro"}
              </Link>
            </div>
          </div>

          <div className={estilos.popupMedalhao}>
            <Medalhao nome={nome} artigo={artigo} />
          </div>
        </div>
      </dialog>
    </>
  );
}

export default PopupDoNome;
