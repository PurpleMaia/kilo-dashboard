type CacheEntry<T> = {
    data: T;
    expires: number;
  };
  
  const cache = new Map<string, CacheEntry<unknown>>();
  
  export function getFromCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
  
    const now = Date.now();
    if (entry.expires < now) {
      cache.delete(key);
      return null;
    }
    return entry.data as T;
  }
  
  export function setInCache<T>(key: string, data: T, ttlMs: number = 1000 * 60): void {
    cache.set(key, {
      data,
      expires: Date.now() + ttlMs,
    });
  }
  