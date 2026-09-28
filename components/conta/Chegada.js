import estilos from "components/conta/conta.module.css";

// A bandeira quadriculada no topo da placa. Só aparece quando a pessoa chega
// ao fim de um caminho: conta ativada, senha nova salva.
function Chegada() {
  return <div className={estilos.chegada} aria-hidden="true" />;
}

export default Chegada;
