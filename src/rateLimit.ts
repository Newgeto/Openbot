import { config } from "./config";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Simple fixed-window rate limiter, keyed by user id.
 * Returns true if the request is allowed, false if the user is over quota.
 */
export function allowRequest(userId: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(userId);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(userId, { count: 1, resetAt: now + config.rateLimitWindowMs });
    return true;
  }

  if (bucket.count >= config.rateLimitMax) {
    return false;
  }

  bucket.count += 1;
  return true;
}
