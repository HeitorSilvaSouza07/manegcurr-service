# Manegcurr Services

Backend monolítico em TypeScript para gerenciamento de candidaturas, currículos e autenticação.

## O que este protótipo entrega

- Auth com JWT e senha com bcrypt.
- CRUD de `cvs` e `positions`.
- Middleware de autorização por propriedade.
- Envelope padrão de resposta.
- Persistência em PostgreSQL com Prisma.
- Validação com Zod.
- Upload local com Multer.

## Setup

1. Copie `.env.example` para `.env`.
2. Ajuste `JWT_SECRET` e os caminhos de uploads, se quiser.
3. Gere o client e aplique a migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```
4. Instale dependências e rode o projeto:

```bash
npm install
npm run build
npm start
```

## Testes

Os testes cobrem o fluxo de autenticação e o CRUD de `positions`.

```bash
npm test
```

## Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `POST /cvs`
- `GET /cvs`
- `GET /cvs/:id`
- `DELETE /cvs/:id`
- `POST /positions`
- `GET /positions`
- `GET /positions/:id`
- `PATCH /positions/:id/status`
- `PUT /positions/:id`
- `DELETE /positions/:id`

## Decisões assumidas

- Sem refresh token.
- Listagens sem paginação.
- Upload de CV usa `multipart/form-data` com o campo `document`.
- O status padrão de nova candidatura é `applied`.
