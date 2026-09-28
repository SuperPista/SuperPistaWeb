import Link from "next/link";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import { LINK_CONTA } from "components/conta/links.js";

// Termos de Uso e Política de Privacidade da conta Super Pista. O texto
// descreve o que o sistema faz hoje (models/, pages/api/). Quando a loja
// passar a receber pedidos, os dados do pedido e do pagamento entram aqui.
//
// A página segue o desenho de "Antes de comprar" da home: título e contato
// numa coluna que acompanha a rolagem, e o texto ao lado.
//
// TODO: incluir razão social, CNPJ e endereço de quem responde pelos dados
// (o controlador, na LGPD) antes de publicar.
function Privacidade() {
  return (
    <Moldura titulo="Termos de Uso e Privacidade" indexar>
      <section className={landing.secao}>
        <div className={`${landing.container} ${landing.faq}`}>
          <div className={landing.faqLado}>
            <div className={landing.faqTexto}>
              <h1 className={landing.h2}>Termos de Uso e Privacidade</h1>
              <p className={estilos.atualizado}>
                Última atualização: 28 de setembro de 2026.
              </p>
            </div>
            <div className={landing.faqContato}>
              <h2 className={landing.h3}>Ficou alguma dúvida?</h2>
              <p className={landing.faqContatoTexto}>
                Escreva para a gente. Pedidos sobre os seus dados também chegam
                por aqui.
              </p>
              <a
                className={landing.faqContatoLink}
                href="mailto:contato@superpista.com"
              >
                contato@superpista.com
              </a>
            </div>
          </div>

          <div className={estilos.documento}>
            <h2>O que estes termos cobrem</h2>
            <p>
              Estes Termos de Uso e esta Política de Privacidade valem para o
              site superpista.com e para a conta Super Pista, que também é usada
              no aplicativo. Ao criar a conta, você declara que leu e aceita o
              que está aqui.
            </p>

            <h2>A conta é de um adulto</h2>
            <p>
              A conta deve ser criada por um adulto: pai, mãe ou responsável. As
              crianças brincam com o tabuleiro e com o aplicativo sempre com um
              adulto por perto. Não pedimos dados das crianças para criar a
              conta.
            </p>
            <p>
              O nome que você digita na prévia do tabuleiro, no site, fica só no
              seu navegador e não é enviado para nós.
            </p>

            <h2>Os dados que guardamos</h2>
            <ul>
              <li>
                Da conta: nome de usuário, e-mail, senha e a data em que você
                aceitou estes termos. A senha é guardada embaralhada (hash
                bcrypt), nunca como você a digitou.
              </li>
              <li>
                Da sessão: um cookie chamado session_id, que mantém você
                conectado por até 30 dias. Não usamos cookies de publicidade nem
                de rastreamento.
              </li>
              <li>
                Dos links enviados por e-mail: quando foram criados, quando
                vencem e se já foram usados. O link de ativação vale 15 minutos
                e o de criar uma senha nova vale 30.
              </li>
              <li>
                Registros de acesso: ações como criar a conta, entrar, sair e
                trocar a senha, com a data e o endereço IP de onde vieram.
              </li>
            </ul>

            <h2>Para que usamos</h2>
            <ul>
              <li>Criar e manter a sua conta, no site e no aplicativo.</li>
              <li>
                Mandar os e-mails da conta: ativação, link para criar uma senha
                nova e avisos de segurança, como o de senha trocada.
              </li>
              <li>
                Proteger a conta contra acesso indevido e investigar abusos.
              </li>
            </ul>
            <p>
              Os e-mails da conta não trazem propaganda. Não vendemos nem
              alugamos os seus dados.
            </p>

            <h2>Base legal</h2>
            <p>
              Tratamos os dados da conta para cumprir o que combinamos com você
              (LGPD, art. 7º, V). Os registros de acesso existem por obrigação
              legal (art. 7º, II, e Marco Civil da Internet, art. 15) e pelo
              nosso interesse legítimo em manter a conta segura (art. 7º, IX).
            </p>

            <h2>Com quem compartilhamos</h2>
            <p>
              Só com as empresas que hospedam o site e o banco de dados e com o
              serviço que entrega os e-mails da conta. Elas usam os dados apenas
              para prestar esse serviço. Também entregamos dados a autoridades
              quando a lei ou uma ordem judicial exigir.
            </p>

            <h2>Por quanto tempo</h2>
            <ul>
              <li>Os dados da conta ficam enquanto a conta existir.</li>
              <li>
                Sessões e links deixam de valer quando vencem ou são usados, e
                são apagados junto com a conta.
              </li>
              <li>
                Os registros de acesso ficam guardados por pelo menos 6 meses, o
                prazo que o Marco Civil da Internet exige, mesmo depois que a
                conta é excluída.
              </li>
            </ul>

            <h2>Os seus direitos</h2>
            <p>
              A LGPD (art. 18) garante a você saber quais dados temos,
              recebê-los, corrigi-los e pedir que sejam apagados. Na{" "}
              <Link href={LINK_CONTA}>Minha conta</Link> você baixa todos os
              seus dados em um arquivo e exclui a conta sozinho. Para corrigir
              alguma coisa ou tirar dúvidas, escreva para{" "}
              <a href="mailto:contato@superpista.com">contato@superpista.com</a>
              .
            </p>

            <h2>Segurança</h2>
            <p>
              A senha é guardada embaralhada, o cookie de sessão não pode ser
              lido por scripts da página e os links enviados por e-mail vencem e
              funcionam uma vez só. Quando a senha é trocada, avisamos por
              e-mail e encerramos as outras sessões.
            </p>
            <p>
              Encontrou uma falha de segurança? Conte para a gente em
              particular, pelo contato@superpista.com, antes de divulgar.
            </p>

            <h2>Usar a conta</h2>
            <ul>
              <li>
                Você cuida da sua senha. Não compartilhe a conta com quem não é
                da família.
              </li>
              <li>
                Informe um e-mail que é seu: é por ele que chegam a ativação e a
                troca de senha.
              </li>
              <li>
                Podemos suspender uma conta usada para fraude, abuso ou para
                atrapalhar o site e o aplicativo.
              </li>
            </ul>

            <h2>Mudanças nestes termos</h2>
            <p>
              Quando mudarmos algo importante aqui, avisamos pelo e-mail da
              conta antes de a mudança valer. A data no topo da página mostra a
              versão atual.
            </p>
          </div>
        </div>
      </section>
      <Faixa chegada />
    </Moldura>
  );
}

export default Privacidade;
