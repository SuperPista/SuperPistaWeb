import Image from "next/image";
import estilos from "components/loja/loja.module.css";

// A primeira foto do produto, num cartão ou numa linha da sacola. Preenche a
// moldura de quem usa, que precisa ser `position: relative`. A arte recortada,
// sem fundo, aparece inteira; a foto cobre a moldura. `decorativa` é para
// quando o nome do produto já está escrito ao lado. `adiantada` é para a foto
// que aparece logo que a página abre: carrega junto com ela, em vez de esperar
// a rolagem chegar perto.
function Retrato({ produto, sizes, decorativa = false, adiantada = false }) {
  const [foto] = produto.fotos;

  return (
    <Image
      className={foto.recortada ? estilos.conter : estilos.cobrir}
      src={foto.src}
      alt={decorativa ? "" : foto.descricao}
      fill
      sizes={sizes}
      loading={adiantada ? "eager" : undefined}
    />
  );
}

export default Retrato;
