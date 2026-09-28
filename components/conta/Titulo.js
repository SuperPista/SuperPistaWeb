import { useEffect, useRef } from "react";
import estilos from "components/conta/conta.module.css";

// Título da placa. Quando a placa troca de estado sem trocar de página (o
// cadastro enviado, a conta ativada), `focar` leva o foco até ele, para quem
// usa leitor de tela ouvir o que mudou.
function Titulo({ children, focar = false }) {
  const referencia = useRef(null);

  useEffect(() => {
    if (focar) {
      referencia.current?.focus();
    }
  }, [focar]);

  return (
    <h1 className={estilos.titulo} ref={referencia} tabIndex={-1}>
      {children}
    </h1>
  );
}

export default Titulo;
