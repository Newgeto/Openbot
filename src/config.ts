import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in environment`);
  return value;
}

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  discordToken: required("DISCORD_TOKEN"),
  openaiApiKey: required("OPENAI_API_KEY"),
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  systemPrompt:
    process.env.SYSTEM_PROMPT ||
    "Tu es OpenBot, un chatbot Discord simple, utile et concis. Réponds en français.",

  // Conversation memory
  historyMaxMessages: int("HISTORY_MAX_MESSAGES", 10),
  historyTtlMs: int("HISTORY_TTL_MINUTES", 30) * 60 * 1000,

  // Rate limiting (per user)
  rateLimitMax: int("RATE_LIMIT_MAX", 5),
  rateLimitWindowMs: int("RATE_LIMIT_WINDOW_SECONDS", 30) * 1000
} as const;
