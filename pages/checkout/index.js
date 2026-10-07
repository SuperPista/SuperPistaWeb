import { useEffect, useId, useState } from "react";
import { useRouter } from "next/router";

import landing from "components/landing/landing.module.css";
import estilos from "components/loja/loja.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import Campo from "components/conta/Campo.js";
import useConta from "components/conta/useConta.js";
import Percurso from "components/loja/Percurso.js";
import Resumo from "components/loja/Resumo.js";
import Selecao from "components/loja/Selecao.js";
import useSacola, { useResumoDaSacola } from "components/loja/useSacola.js";
import usePedido, { montarPedidoDeExemplo } from "components/loja/usePedido.js";
import {
  DADOS_VAZIOS,
  ESTADOS,
  conferirDados,
  formatarCelular,
  formatarCep,
  formatarCpf,
} from "components/loja/campos.js";
import { LINK_SACOLA, linkDoPedido } from "components/loja/links.js";

// Dados de quem recebe e endereço de entrega. A compra não pede conta: basta
// o e-mail. Quem já entrou no site encontra o e-mail da conta preenchido.
//
// TODO: o pagamento ainda não existe. O botão monta um pedido de exemplo no
// navegador (components/loja/usePedido.js) e a tela avisa disso.
function Checkout() {
  const router = useRouter();
  const idFormulario = useId();
  const idQuem = useId();
  const idOnde = useId();

  const pronto = useSacola((estado) => estado.pronto);
  const esvaziar = useSacola((estado) => estado.esvaziar);
  const registrar = usePedido((estado) => estado.registrar);
  const resumo = useResumoDaSacola();
  const { usuario } = useConta();

  const [dados, setDados] = useState(DADOS_VAZIOS);
  const [mexeuNoEmail, setMexeuNoEmail] = useState(false);
  const [conferir, setConferir] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // o e-mail da conta vale até a pessoa mexer no campo
  const valores =
    usuario && !mexeuNoEmail ? { ...dados, email: usuario.email } : dados;

  // Os erros de cada campo só aparecem depois da primeira tentativa de enviar,
  // para ninguém levar bronca enquanto ainda está digitando.
  const erros = conferir ? conferirDados(valores) : {};

  useEffect(() => {
    if (pronto && resumo.vazia && !enviando) {
      router.replace(LINK_SACOLA);
    }
  }, [pronto, resumo.vazia, enviando, router]);

  function aoMudar(campo, formatar = (texto) => texto) {
    return (evento) => {
      const valor = formatar(evento.target.value);

      if (campo === "email") {
        setMexeuNoEmail(true);
      }

      setDados((atuais) => ({ ...atuais, [campo]: valor }));
    };
  }

  function aoEnviar(evento) {
    evento.preventDefault();
    setConferir(true);

    const [primeiroComErro] = Object.keys(conferirDados(valores));

    if (primeiroComErro) {
      evento.currentTarget.elements[primeiroComErro]?.focus();
      return;
    }

    setEnviando(true);

    const pedido = montarPedidoDeExemplo({
      resumo,
      comprador: { nome: valores.nome.trim(), email: valores.email.trim() },
      entrega: {
        cep: valores.cep,
        rua: valores.rua.trim(),
        numero: valores.numero.trim(),
        complemento: valores.complemento.trim(),
        bairro: valores.bairro.trim(),
        cidade: valores.cidade.trim(),
        estado: valores.estado,
      },
    });

    registrar(pedido);
    esvaziar();
    router.push(linkDoPedido(pedido.id));
  }

  return (
    <Moldura titulo="Fechar pedido" classe={estilos.pagina}>
      <section className={estilos.compraSecao}>
        <div className={landing.container}>
          <Percurso atual={1} />

          <h1 className={estilos.tituloDaTela}>Fechar pedido</h1>

          {!pronto || resumo.vazia ? (
            <p className={estilos.espera} role="status">
              {enviando ? "Fechando o pedido." : "Abrindo a sacola."}
            </p>
          ) : (
            <div className={estilos.duasColunas}>
              <form id={idFormulario} noValidate onSubmit={aoEnviar}>
                <section className={estilos.bloco} aria-labelledby={idQuem}>
                  <h2 className={estilos.blocoTitulo} id={idQuem}>
                    Quem recebe
                  </h2>
                  <div className={estilos.campos}>
                    <div className={estilos.inteiro}>
                      <Campo
                        rotulo="Nome completo"
                        name="nome"
                        autoComplete="name"
                        erro={erros.nome}
                        value={valores.nome}
                        onChange={aoMudar("nome")}
                      />
                    </div>
                    <div className={estilos.inteiro}>
                      <Campo
                        rotulo="E-mail"
                        type="email"
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        dica="É para ele que vão a confirmação e o código de rastreio."
                        erro={erros.email}
                        value={valores.email}
                        onChange={aoMudar("email")}
                      />
                    </div>
                    <div className={estilos.metade}>
                      <Campo
                        rotulo="Celular"
                        type="tel"
                        name="celular"
                        autoComplete="tel-national"
                        inputMode="tel"
                        placeholder="(00) 00000-0000"
                        erro={erros.celular}
                        value={valores.celular}
                        onChange={aoMudar("celular", formatarCelular)}
                      />
                    </div>
                    <div className={estilos.metade}>
                      <Campo
                        rotulo="CPF"
                        name="cpf"
                        autoComplete="off"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        dica="Vai na nota fiscal."
                        erro={erros.cpf}
                        value={valores.cpf}
                        onChange={aoMudar("cpf", formatarCpf)}
                      />
                    </div>
                  </div>
                </section>

                <section className={estilos.bloco} aria-labelledby={idOnde}>
                  <h2 className={estilos.blocoTitulo} id={idOnde}>
                    Onde entregar
                  </h2>
                  <p className={estilos.blocoTexto}>
                    O frete é grátis para todo o Brasil.
                  </p>
                  <div className={estilos.campos}>
                    <div className={estilos.terco}>
                      <Campo
                        rotulo="CEP"
                        name="cep"
                        autoComplete="postal-code"
                        inputMode="numeric"
                        placeholder="00000-000"
                        erro={erros.cep}
                        value={valores.cep}
                        onChange={aoMudar("cep", formatarCep)}
                      />
                    </div>
                    <div className={estilos.doisTercos}>
                      <Campo
                        rotulo="Rua ou avenida"
                        name="rua"
                        autoComplete="address-line1"
                        erro={erros.rua}
                        value={valores.rua}
                        onChange={aoMudar("rua")}
                      />
                    </div>
                    <div className={estilos.terco}>
                      <Campo
                        rotulo="Número"
                        name="numero"
                        autoComplete="off"
                        erro={erros.numero}
                        value={valores.numero}
                        onChange={aoMudar("numero")}
                      />
                    </div>
                    <div className={estilos.doisTercos}>
                      <Campo
                        rotulo="Complemento (opcional)"
                        name="complemento"
                        autoComplete="address-line2"
                        placeholder="Apartamento, bloco, casa dos fundos"
                        value={valores.complemento}
                        onChange={aoMudar("complemento")}
                      />
                    </div>
                    <div className={estilos.terco}>
                      <Campo
                        rotulo="Bairro"
                        name="bairro"
                        autoComplete="address-level3"
                        erro={erros.bairro}
                        value={valores.bairro}
                        onChange={aoMudar("bairro")}
                      />
                    </div>
                    <div className={estilos.terco}>
                      <Campo
                        rotulo="Cidade"
                        name="cidade"
                        autoComplete="address-level2"
                        erro={erros.cidade}
                        value={valores.cidade}
                        onChange={aoMudar("cidade")}
                      />
                    </div>
                    <div className={estilos.terco}>
                      <Selecao
                        rotulo="Estado"
                        name="estado"
                        autoComplete="address-level1"
                        opcoes={ESTADOS}
                        erro={erros.estado}
                        value={valores.estado}
                        onChange={aoMudar("estado")}
                      />
                    </div>
                  </div>
                </section>
              </form>

              <Resumo titulo="Seu pedido" contas={resumo} comItens>
                <div className={estilos.exemplo}>
                  <p className={estilos.exemploTitulo}>
                    O pagamento ainda não está ligado
                  </p>
                  <p>
                    A loja está em montagem. O botão abaixo mostra um pedido de
                    exemplo: nada é cobrado e nada é enviado para a Super Pista.
                  </p>
                </div>
                <button
                  className={landing.botao}
                  type="submit"
                  form={idFormulario}
                  disabled={enviando}
                >
                  Ir para o pagamento
                </button>
                <p className={`${estilos.resumoNota} ${landing.dado}`}>
                  Na próxima etapa você escolhe Pix, boleto ou cartão.
                </p>
              </Resumo>
            </div>
          )}
        </div>
      </section>
      <Faixa />
    </Moldura>
  );
}

export default Checkout;
