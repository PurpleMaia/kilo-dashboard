import { cookies } from 'next/headers';
import { User, Session, validateSessionToken } from './utils';

interface CachedUser {
  user: User;
  cachedAt: number;
  expiresAt: number;
}

export class AuthCache {
  private cache = new Map<string, CachedUser>();
  private readonly TTL = 20 * 60 * 1000; // 20 minutes
  private readonly CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Auto-cleanup expired entries
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * Get user from cache or database
   */
  async getUser(sessionToken: string): Promise<User | null> {
    try {
      const cached = this.cache.get(sessionToken);
      
      // Return cached user if valid
      if (cached && Date.now() < cached.expiresAt) {
        console.log('Auth cache hit for token:', sessionToken.slice(0, 8) + '...');
        return cached.user;
      }

      console.log('Auth cache miss, validating session...');
      
      // Validate session and get user data in single query
      const result = await validateSessionToken(sessionToken);
      
      if (!result.user || !result.session) {
        this.cache.delete(sessionToken);
        return null;
      }

      // Cache the result
      this.cache.set(sessionToken, {
        user: result.user,
        cachedAt: Date.now(),
        expiresAt: Date.now() + this.TTL,
      });

      return result.user;
    } catch (error) {
      console.error('Auth cache error:', error);
      return null;
    }
  }

  /**
   * Get current user from request cookies
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const sessionCookie = (await cookies()).get('auth_session');
      
      if (!sessionCookie?.value) {
        return null;
      }

      return await this.getUser(sessionCookie.value);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Invalidate user from cache
   */
  invalidateUser(sessionToken: string): void {
    this.cache.delete(sessionToken);
    console.log('🗑️ Invalidated user cache for token:', sessionToken.slice(0, 8) + '...');
  }

  /**
   * Invalidate all cached users (logout all)
   */
  invalidateAll(): void {
    this.cache.clear();
    console.log('🗑️ Cleared all user cache');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.cache.size;
    const expired = Array.from(this.cache.values())
      .filter(cached => Date.now() >= cached.expiresAt).length;
    
    return {
      total,
      active: total - expired,
      expired,
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [token, cached] of this.cache.entries()) {
      if (now >= cached.expiresAt) {
        this.cache.delete(token);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired auth cache entries`);
    }
  }
}

export const authCache = new AuthCache();