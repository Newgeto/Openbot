const DISCORD_MESSAGE_LIMIT = 2000;

/**
 * Splits a string into chunks that fit within Discord's 2000-character limit.
 * Tries to break on newlines first, then on spaces, and falls back to a hard
 * cut so a single very long token can never exceed the limit.
 */
export function splitMessage(
  text: string,
  limit: number = DISCORD_MESSAGE_LIMIT
): string[] {
  if (text.length <= limit) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf("\n", limit);
    if (cut <= 0) cut = remaining.lastIndexOf(" ", limit);
    if (cut <= 0) cut = limit;

    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).replace(/^[\n ]+/, "");
  }

  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}
