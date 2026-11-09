import { useState } from "react";
import Image from "next/image";
import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";

// As fotos do produto: uma grande e, quando há mais de uma, as miniaturas
// embaixo. A arte recortada, sem fundo, aparece inteira; as fotos preenchem a
// moldura. Imagem que ainda não é a foto de verdade leva o aviso embaixo.
function Galeria({ produto }) {
  const { fotos } = produto;
  const [indice, setIndice] = useState(0);
  const foto = fotos[indice];

  return (
    <div className={estilos.galeria}>
      <div className={estilos.fotoPrincipal}>
        <Image
          className={foto.recortada ? estilos.conter : estilos.cobrir}
          src={foto.src}
          alt={foto.descricao}
          fill
          sizes="(min-width: 900px) 620px, 92vw"
          priority
        />
      </div>

      {foto.ilustrativa && (
        <p className={`${estilos.fotoNota} ${landing.dado}`}>
          Imagem ilustrativa: a foto deste produto ainda vai chegar.
        </p>
      )}

      {fotos.length > 1 && (
        <ul className={estilos.miniaturas}>
          {fotos.map((miniatura, posicao) => (
            <li key={miniatura.src}>
              <button
                className={estilos.miniatura}
                type="button"
                aria-label={`Foto ${posicao + 1} de ${fotos.length}`}
                aria-pressed={posicao === indice}
                onClick={() => setIndice(posicao)}
              >
                <Image
                  className={
                    miniatura.recortada ? estilos.conter : estilos.cobrir
                  }
                  src={miniatura.src}
                  alt=""
                  fill
                  sizes="120px"
                  loading="eager"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Galeria;
