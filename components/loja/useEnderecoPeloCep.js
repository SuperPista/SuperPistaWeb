import { useRef, useState } from "react";
import { pedir } from "components/conta/pedir.js";
import { preencherPeloCep } from "components/loja/campos.js";

// O que aparece embaixo do CEP em cada momento da busca.
const AVISOS = {
  procurando: "Buscando o endereço.",
  achou: "Endereço preenchido pelo CEP. Confira e escreva o número.",
  cidadeToda: "Esse CEP é da cidade toda. Escreva a rua e o bairro.",
  naoAchou: "Não achamos esse CEP. Confira os números ou escreva o endereço.",
  falhou: "Não deu para buscar o endereço agora. Preencha os campos à mão.",
};

// Quando o CEP fica completo, busca o endereço (GET /api/v1/zip-codes) e
// preenche rua, bairro, cidade e estado. O CEP só ajuda: tudo continua
// editável, e o foco fica onde a pessoa está digitando.
function useEnderecoPeloCep(setDados) {
  const [aviso, setAviso] = useState(null);
  // O CEP da busca em andamento ou da última feita. Resposta de um CEP que
  // a pessoa já trocou é descartada.
  const cepBuscado = useRef(null);
  // O endereço que o último CEP pôs nos campos (preencherPeloCep).
  const preenchido = useRef({});

  async function buscar(cep) {
    const numeros = cep.replace(/\D/g, "");

    if (numeros.length !== 8) {
      cepBuscado.current = null;
      setAviso(null);
      return;
    }

    if (numeros === cepBuscado.current) {
      return;
    }

    cepBuscado.current = numeros;
    setAviso(AVISOS.procurando);

    const resposta = await pedir(`/api/v1/zip-codes/${numeros}`);

    if (cepBuscado.current !== numeros) {
      return;
    }

    const achado = resposta.ok
      ? {
          rua: resposta.corpo.street,
          bairro: resposta.corpo.neighborhood,
          cidade: resposta.corpo.city,
          estado: resposta.corpo.state,
        }
      : {};
    const anterior = preenchido.current;
    preenchido.current = achado;
    setDados((atuais) => preencherPeloCep(atuais, achado, anterior));

    if (resposta.ok) {
      setAviso(achado.rua ? AVISOS.achou : AVISOS.cidadeToda);
    } else {
      setAviso(resposta.status === 404 ? AVISOS.naoAchou : AVISOS.falhou);
    }
  }

  return { aviso, buscar };
}

export default useEnderecoPeloCep;
