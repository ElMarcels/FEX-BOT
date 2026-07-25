# Fex

Fex is an invite-only programming assistant with a Telegram bot and a web chat UI.

Important note: "free and unlimited" is only realistic if you run your own model, for example with Ollama on a VPS or local machine. Hosted AI APIs have cost and rate limits. This project supports both:

- `AI_PROVIDER=ollama` for local/self-hosted models.
- `AI_PROVIDER=openai-compatible` for OpenAI-compatible APIs.

## Structure

```text
fex/
  backend/     Express API, Telegram webhook, Prisma/PostgreSQL
  web/         Next.js app for Vercel
```

## Core Features

- Invite-only access.
- Multiple chats like ChatGPT.
- Folders and categories to organize chats.
- Persistent memory per user.
- Programming-focused system prompt.
- Telegram bot support.
- Web UI deployable to Vercel.

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Create an invite code:

```bash
npm run invite -- --code=FEX-PRIVATE-001
```

Invite link for the web:

```text
https://your-vercel-app.vercel.app/login?invite=FEX-PRIVATE-001
```

Telegram webhook:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=$PUBLIC_API_URL/api/telegram/webhook"
```

## Web Setup

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Deploy `web/` to Vercel and set:

```text
NEXT_PUBLIC_API_URL=https://your-backend.example.com
```

## Deploy

- Backend: deploy `backend/` on Render, Railway, Fly.io, or another Node host.
- Web: deploy `web/` on Vercel.
- Database: use managed PostgreSQL or the included `docker-compose.yml` locally.


## Recommended Free AI Runtime

Run Ollama:

```bash
ollama serve
ollama pull qwen2.5-coder:7b
```

Backend environment:

```text
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b
```

On hosted platforms such as Render, set `AI_PROVIDER=openai-compatible` unless
you also host an Ollama-compatible model endpoint reachable from the backend.
