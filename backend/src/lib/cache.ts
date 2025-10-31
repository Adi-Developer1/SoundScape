const cache = new Map<string, { ts: number; value: any }>();

export function getCache(key: string, ttl = 60) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.ts > ttl * 1000) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

export function setCache(key: string, value: any) {
  cache.set(key, { ts: Date.now(), value });
}
