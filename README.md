# Super Pista

Plataforma web da **Super Pista** — o tabuleiro/brinquedo com Realidade Aumentada.

O site não é o jogo: ele existe para **autenticação de contas** e para a **loja**, onde o
tabuleiro é vendido. A experiência de Realidade Aumentada acontece no aplicativo, que usa
a conta criada aqui.

> **Produção:** [https://superpista.com](https://superpista.com)

## Escopo

- **Login e contas** — cadastro, ativação por e-mail, sessões e edição de usuário.
- **Loja** — página de venda do tabuleiro Super Pista.

Qualquer coisa fora disso (gameplay, rastreamento de marcadores, AR) fica no aplicativo.

## Stack

- [Next.js](https://nextjs.org/) + React (páginas e API Routes)
- PostgreSQL com migrations via [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
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
| `npm run migrations:up`     | Aplica as migrations pendentes                       |
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

## API

| Endpoint                               | Descrição                          |
| -------------------------------------- | ---------------------------------- |
| `GET /api/v1/status`                   | Status do sistema e do banco       |
| `POST /api/v1/users`                   | Cria uma conta                     |
| `GET /api/v1/users/[username]`         | Dados públicos de um usuário       |
| `PATCH /api/v1/users/[username]`       | Atualiza um usuário                |
| `GET /api/v1/user`                     | Usuário da sessão atual            |
| `POST /api/v1/sessions`                | Login                              |
| `DELETE /api/v1/sessions`              | Logout                             |
| `PATCH /api/v1/activations/[token_id]` | Ativa a conta pelo token do e-mail |
| `POST /api/v1/migrations`              | Aplica migrations                  |

## Licença

MIT — veja [LICENSE](LICENSE).
