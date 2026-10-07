# Super Pista

Plataforma web da **Super Pista** — o tabuleiro/brinquedo com Realidade Aumentada.

O site não é o jogo: ele existe para **autenticação de contas** e para a **loja**, onde o
tabuleiro é vendido. A experiência de Realidade Aumentada acontece no aplicativo, que usa
a conta criada aqui.

> **Produção:** [https://superpista.com](https://superpista.com)

## Escopo

- **Login e contas** — cadastro, ativação por e-mail, login, recuperação de senha e a
  área Minha conta (trocar senha, baixar os dados e excluir a conta).
- **Loja** — página de venda do tabuleiro Super Pista.

Qualquer coisa fora disso (gameplay, rastreamento de marcadores, AR) fica no aplicativo.

## Stack

- [Next.js](https://nextjs.org/) + React (páginas e API Routes)
- PostgreSQL com migrations via [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [Zustand](https://zustand.docs.pmnd.rs/) para o que fica guardado no navegador (sacola e nome da criança)
- Docker Compose para os serviços de desenvolvimento (banco e servidor de e-mail)
- Jest para testes unitários e de integração

## Requisitos

- Node.js 24 (a versão exata está no `.nvmrc`)
- Docker e Docker Compose

## Como rodar

O `.env.development` é versionado de propósito: ele só guarda credenciais locais,
então nenhum segredo entra nele. Segredo de verdade vive apenas no painel de deploy.

```bash
npm install
npm run dev
```

O comando `dev` sobe os serviços no Docker, aguarda o Postgres ficar pronto, aplica as
migrations e inicia o Next.js em <http://localhost:3000>.

Os e-mails de ativação enviados em desenvolvimento não saem para a internet: eles caem no
MailCatcher, que pode ser aberto em <http://localhost:1080>.

## Scripts

| Script                      | O que faz                                            |
| --------------------------- | ---------------------------------------------------- |
| `npm run dev`               | Sobe os serviços, roda as migrations e inicia o site |
| `npm test`                  | Roda a suíte completa de testes                      |
| `npm run test:watch`        | Roda os testes em modo watch                         |
| `npm run services:up`       | Sobe apenas os containers                            |
| `npm run services:stop`     | Para os containers                                   |
| `npm run services:down`     | Remove os containers                                 |
| `npm run migrations:create` | Cria uma nova migration                              |
| `npm run migrations:up:dev` | Aplica as migrations pendentes no banco local        |
| `npm run migrations:up`     | Aplica as migrations com o ambiente do deploy        |
| `npm run lint:prettier:fix` | Formata o código                                     |
| `npm run commit`            | Commit guiado pelo Commitizen                        |

## Testes

```bash
npm test
```

Os testes de integração sobem o Next.js e conversam com a API de verdade, então precisam
dos serviços do Docker rodando — o próprio `npm test` cuida disso.

## Commits

O projeto segue [Conventional Commits](https://www.conventionalcommits.org/pt-br/), validados
pelo commitlint. O hook `commit-msg` do husky barra a mensagem fora do padrão, e o mesmo
check roda no CI sobre todos os commits do pull request.

```bash
npm run commit   # commit guiado pelo Commitizen
```

## CI

Todo pull request dispara dois workflows no GitHub Actions:

- **Linting** — `prettier --check`, `eslint --max-warnings 0` e `commitlint`
- **Automated Tests** — a suíte completa do Jest

## Páginas da conta

| Página                        | O que faz                                              |
| ----------------------------- | ------------------------------------------------------ |
| `/login`                      | Entrar com e-mail e senha                              |
| `/cadastro`                   | Criar conta, com aceite dos termos                     |
| `/cadastro/ativar/[token_id]` | Link de ativação enviado por e-mail                    |
| `/recuperar-senha`            | Pedir por e-mail o link para criar uma senha nova      |
| `/recuperar-senha/[token]`    | Link enviado por e-mail para criar a senha nova        |
| `/conta`                      | Minha conta: sair, trocar senha, baixar dados, excluir |
| `/privacidade`                | Termos de Uso e Política de Privacidade                |

## Páginas da loja

| Página         | O que faz                                                |
| -------------- | -------------------------------------------------------- |
| `/`            | Home, que é a loja: um produto no topo e a prateleira    |
| `/loja`        | A prateleira sozinha, com todos os produtos              |
| `/loja/[slug]` | Página do produto: fotos, preço, nome da criança, compra |
| `/sacola`      | Sacola de compras, guardada no navegador                 |
| `/checkout`    | Dados de quem recebe e endereço de entrega               |
| `/pedido/[id]` | Pedido recebido e o caminho dele até a entrega           |
| `/aplicativo`  | Como ativar o aplicativo, para quem já comprou           |
| `/duvidas`     | As perguntas de antes da compra                          |
| `/tabuleiro`   | Landing do tabuleiro, que termina pondo ele na sacola    |

A loja ainda é só frontend. O catálogo está em `components/loja/catalogo.js`: quatro
tabuleiros, cada um com uma cidade diferente, e dois kits, todos na mesma prateleira. A
sacola fica no navegador e o checkout termina num pedido de exemplo, sem pagamento: as
telas avisam disso. Só o tabuleiro vermelho tem fotos de verdade; as imagens em
`public/loja` são ilustrativas, feitas da arte dele e de uma foto que o site já tinha,
e as telas também avisam. Os pontos em que o backend entra estão marcados com `TODO` em
`components/loja/`.

## API

| Endpoint                                | Descrição                          |
| --------------------------------------- | ---------------------------------- |
| `GET /api/v1/status`                    | Status do sistema e do banco       |
| `POST /api/v1/users`                    | Cria uma conta                     |
| `GET /api/v1/users/[username]`          | Dados de um usuário (com sessão)   |
| `PATCH /api/v1/users/[username]`        | Atualiza username ou e-mail        |
| `DELETE /api/v1/users/[username]`       | Exclui a conta                     |
| `GET /api/v1/user`                      | Usuário da sessão atual            |
| `POST /api/v1/user/password`            | Troca a senha, pedindo a atual     |
| `GET /api/v1/user/export`               | Baixa os dados da conta (LGPD)     |
| `POST /api/v1/sessions`                 | Login                              |
| `DELETE /api/v1/sessions`               | Logout                             |
| `PATCH /api/v1/activations/[token_id]`  | Ativa a conta pelo token do e-mail |
| `POST /api/v1/password-resets`          | Envia o link de senha nova         |
| `PATCH /api/v1/password-resets/[token]` | Grava a senha nova pelo link       |
| `POST /api/v1/migrations`               | Aplica migrations                  |

O cadastro e o pedido de senha nova respondem igual exista a conta ou não, para não
revelar quem é cliente. Os dois mandam no máximo um e-mail a cada 5 minutos por conta.

## Deploy

O build da Vercel roda `vercel-build`, que aplica as migrations antes do `next build`.
Ele usa as variáveis `POSTGRES_*` do ambiente do deploy, inclusive nos deploys de
preview: confira que o preview não aponta para o banco de produção.

## Licença

MIT — veja [LICENSE](LICENSE).
