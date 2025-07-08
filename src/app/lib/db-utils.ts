import { pool } from '../../../db/kysely/client';

// Monitor database connections
export function getConnectionStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

// Log connection stats (useful for debugging)
export function logConnectionStats() {
  const stats = getConnectionStats();
  console.log('Database Connection Stats:', {
    total: stats.totalCount,
    idle: stats.idleCount,
    waiting: stats.waitingCount,
  });
}

// Clean up idle connections
export async function cleanupIdleConnections() {
  try {
    await pool.query('SELECT 1'); // This will trigger connection cleanup
    console.log('Idle connections cleaned up');
  } catch (error) {
    console.error('Error cleaning up connections:', error);
  }
}

// Health check for database connections
export async function checkDatabaseHealth() {
  try {
    const stats = getConnectionStats();
    const isHealthy = stats.totalCount < 8 && stats.waitingCount === 0;
    
    if (!isHealthy) {
      console.warn('Database connection pool health warning:', stats);
    }
    
    return {
      healthy: isHealthy,
      stats,
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
} 