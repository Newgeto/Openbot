import { config } from "./config";

export type ChatRole = "user" | "assistant";

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

interface ChannelHistory {
  turns: ChatTurn[];
  lastActivity: number;
}

/**
 * In-memory conversation store, keyed by Discord channel id.
 * Keeps a bounded window of recent turns and expires idle channels,
 * so the bot has short-term context without growing unbounded.
 */
const channels = new Map<string, ChannelHistory>();

function prune(history: ChannelHistory): void {
  const max = config.historyMaxMessages;
  if (history.turns.length > max) {
    history.turns.splice(0, history.turns.length - max);
  }
}

function expireIdle(now: number): void {
  for (const [channelId, history] of channels) {
    if (now - history.lastActivity > config.historyTtlMs) {
      channels.delete(channelId);
    }
  }
}

export function getHistory(channelId: string): ChatTurn[] {
  expireIdle(Date.now());
  return channels.get(channelId)?.turns ?? [];
}

export function recordTurn(channelId: string, turn: ChatTurn): void {
  const now = Date.now();
  let history = channels.get(channelId);
  if (!history) {
    history = { turns: [], lastActivity: now };
    channels.set(channelId, history);
  }
  history.turns.push(turn);
  history.lastActivity = now;
  prune(history);
}
