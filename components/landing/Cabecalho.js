import Image from "next/image";
import estilos from "components/landing/landing.module.css";
import BotaoComprar from "components/landing/BotaoComprar.js";

// Sem menu e sem link para o site: a landing só tem um caminho, o checkout.
function Cabecalho() {
  return (
    <header className={estilos.cabecalho}>
      <div className={`${estilos.container} ${estilos.cabecalhoLinha}`}>
        <Image
          className={estilos.marca}
          src="/landing/logo-super-pista.webp"
          alt="Super Pista"
          width={640}
          height={414}
          priority
        />
        <BotaoComprar compacto />
      </div>
    </header>
  );
}

export default Cabecalho;
