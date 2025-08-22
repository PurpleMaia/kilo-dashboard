type CacheEntry<T> = {
  data: T;
  expires: number;
  version: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
let currentVersion = 1; // Global version counter

export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  
  // Check expiration OR version mismatch
  if (entry.expires < now || entry.version !== currentVersion) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

export function setInCache<T>(key: string, data: T, ttlMs: number = 1000 * 60): void {
  cache.set(key, {
    data,
    expires: Date.now() + ttlMs,
    version: currentVersion, // Tag with current version
  });
}

export function invalidateAllCache(): void {
  currentVersion++; // Increment version = all existing cache becomes invalid
  console.log('Cache invalidated, new version:', currentVersion);
}

export function clearCache(): void {
  cache.clear();
  console.log(cache)
  currentVersion++;
}