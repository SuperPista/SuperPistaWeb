import Link from "next/link";

import landing from "components/landing/landing.module.css";
import estilos from "components/conta/conta.module.css";
import Faixa from "components/landing/Faixa.js";
import Moldura from "components/conta/Moldura.js";
import { LINK_CONTA } from "components/conta/links.js";

// Termos de Uso e Política de Privacidade da conta e da loja Super Pista. O
// texto descreve o que o sistema faz hoje (models/, pages/api/): o que muda
// nos dados da conta, do pedido ou do pagamento muda aqui também.
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
                Última atualização: 28 de outubro de 2026.
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
              site superpista.com, para a conta Super Pista, que também é usada
              no aplicativo, e para os pedidos feitos na loja. Ao criar a conta,
              você declara que leu e aceita o que está aqui.
            </p>

            <h2>A conta e os pedidos são de um adulto</h2>
            <p>
              A conta deve ser criada por um adulto: pai, mãe ou responsável, e
              os pedidos da loja também são feitos por um adulto. As crianças
              brincam com o tabuleiro e com o aplicativo sempre com um adulto
              por perto. Não pedimos dados das crianças para criar a conta.
            </p>
            <p>
              O nome que você digita na prévia do tabuleiro e a sacola de
              compras ficam só no seu navegador. O nome só chega até nós quando
              você fecha um pedido com ele: vai junto com o pedido, para ser
              impresso no tabuleiro. Pode ser um apelido.
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
              <li>
                Dos pedidos: nome, e-mail, celular e CPF de quem compra, o
                endereço de entrega, os produtos com o nome que vai impresso em
                cada tabuleiro, os valores e a situação do pagamento. Os dados
                do cartão são digitados na página da AbacatePay e não passam por
                nós.
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
                Cobrar, entregar e emitir a nota fiscal dos pedidos, e falar com
                você sobre eles por e-mail ou celular.
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
              Os dados dos pedidos servem para cumprir a compra (art. 7º, V) e
              ficam guardados por obrigação fiscal (art. 7º, II).
            </p>

            <h2>Com quem compartilhamos</h2>
            <p>
              Só com as empresas que hospedam o site e o banco de dados, com o
              serviço que entrega os e-mails da conta e, nos pedidos, com quem
              cobra e com quem entrega:
            </p>
            <ul>
              <li>
                A AbacatePay processa o pagamento e recebe o nome, o e-mail, o
                celular e o CPF de quem compra, os produtos e o valor. O
                endereço e o nome impresso no tabuleiro não vão para ela.
              </li>
              <li>
                Quem faz a entrega recebe o nome de quem compra e o endereço de
                entrega.
              </li>
            </ul>
            <p>
              Essas empresas usam os dados apenas para prestar o serviço delas.
              Também entregamos dados a autoridades quando a lei ou uma ordem
              judicial exigir.
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
              <li>
                Os pedidos ficam guardados por pelo menos 5 anos, o prazo que a
                lei fiscal exige para os registros de venda.
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
            <p>
              Os pedidos não ficam na conta, porque dá para comprar sem ela.
              Para receber, corrigir ou apagar os dados de um pedido, escreva
              para o mesmo e-mail. Os dados de um pedido pago ficam até o fim do
              prazo fiscal, mesmo se você pedir para apagar (LGPD, art. 16, I).
            </p>

            <h2>Segurança</h2>
            <p>
              A senha é guardada embaralhada, o cookie de sessão não pode ser
              lido por scripts da página e os links enviados por e-mail vencem e
              funcionam uma vez só. Quando a senha é trocada, avisamos por
              e-mail e encerramos as outras sessões.
            </p>
            <p>
              O link do pedido não dá para adivinhar, mas mostra o seu nome e o
              endereço de entrega. Só passe o link para quem pode ver esses
              dados.
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
