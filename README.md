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
OPENAI_MODEL=gpt-4o-mini
```

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

## Project Structure

* `src/index.ts`

  * Discord connection
  * Message listener
  * Triggers when the bot is mentioned

* `src/openai.ts`

  * OpenAI API calls (Chat Completions)
