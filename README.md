# OpenBot

OpenBot is a simple Discord bot built with Node.js and TypeScript. It replies when you **mention** it in a Discord channel using the OpenAI API.

## Requirements

* Node.js 20+
* A Discord bot and its token
* An OpenAI API key

## Configuration

1. Create a `.env` file in the project root (you can use `.env.example` as a template).

```env
DISCORD_TOKEN=...
OPENAI_API_KEY=...

# Optional
OPENAI_MODEL=gpt-4o-mini
SYSTEM_PROMPT=Tu es OpenBot, un chatbot Discord simple, utile et concis. Réponds en français.
HISTORY_MAX_MESSAGES=10
HISTORY_TTL_MINUTES=30
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_SECONDS=30
```

### Available options

| Variable | Default | Description |
|---|---|---|
| `DISCORD_TOKEN` | – | Discord bot token (required) |
| `OPENAI_API_KEY` | – | OpenAI API key (required) |
| `OPENAI_MODEL` | `gpt-4o-mini` | Chat model |
| `SYSTEM_PROMPT` | French assistant prompt | Bot personality / instructions |
| `HISTORY_MAX_MESSAGES` | `10` | Recent turns kept as conversation memory (per channel) |
| `HISTORY_TTL_MINUTES` | `30` | Idle time before a channel's memory is cleared |
| `RATE_LIMIT_MAX` | `5` | Max requests per user per window |
| `RATE_LIMIT_WINDOW_SECONDS` | `30` | Rate-limit window length |

2. Invite your bot to your Discord server with the required permissions.

The bot needs access to message content, so make sure:

* `MESSAGE CONTENT INTENT` is enabled in the Discord Developer Portal (**Bot** section).

## Local Usage

```bash
npm install
npm run dev
```

Then, mention the bot in a Discord channel:

```text
@OpenBot hi, can you help me?
```

The bot will reply directly in the channel.

## Docker Usage

1. Create your `.env` file in the project root.

2. Run:

```bash
docker compose up --build
```

## Features

* Replies when mentioned, in any channel it can see
* Short-term **conversation memory** per channel (bounded window, auto-expires when idle)
* **Per-user rate limiting** to protect your OpenAI quota from spam
* Automatically **splits long replies** to respect Discord's 2000-character limit
* Configurable **system prompt** and model via environment variables

## Project Structure

* `src/index.ts` — Discord connection, message listener, orchestration
* `src/openai.ts` — OpenAI API calls (Chat Completions), with history
* `src/config.ts` — centralized, validated environment configuration
* `src/memory.ts` — per-channel conversation memory store
* `src/rateLimit.ts` — per-user fixed-window rate limiter
* `src/discord.ts` — helper to split messages within Discord's limit
