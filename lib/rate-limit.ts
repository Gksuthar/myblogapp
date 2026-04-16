type RateLimitConfig = {
  windowMs: number;
  max: number;
  namespace?: string;
};

type Bucket = {
  count: number;
  resetAt: number;
  lastSeenAt: number;
};

type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

function toPositiveInt(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  const asInt = Math.floor(value);
  return asInt > 0 ? asInt : fallback;
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

export function createRateLimiter(config: RateLimitConfig) {
  const windowMs = toPositiveInt(config.windowMs, 60_000);
  const max = toPositiveInt(config.max, 60);
  const namespace = (config.namespace || 'default').trim() || 'default';
  const buckets = new Map<string, Bucket>();

  function prune(now: number) {
    if (buckets.size < 1000) return;

    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now || now - bucket.lastSeenAt > windowMs * 10) {
        buckets.delete(key);
      }
    }
  }

  function consume(id: string): RateLimitDecision {
    const now = Date.now();
    prune(now);

    const normalizedId = String(id || 'unknown').slice(0, 200);
    const key = `${namespace}:${normalizedId}`;

    const existing = buckets.get(key);
    if (!existing || now >= existing.resetAt) {
      const resetAt = now + windowMs;
      const initialCount = 1;
      buckets.set(key, {
        count: initialCount,
        resetAt,
        lastSeenAt: now,
      });

      return {
        allowed: true,
        remaining: Math.max(0, max - initialCount),
        retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
      };
    }

    existing.count += 1;
    existing.lastSeenAt = now;

    const allowed = existing.count <= max;
    return {
      allowed,
      remaining: Math.max(0, max - existing.count),
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { consume };
}
