// Cache duration constants for authentication and CSRF tokens
export const CACHE_DURATIONS = {
  // Authentication cache duration (how long to trust cached auth status)
  AUTH: {
    DEFAULT: 15 * 60 * 1000, // 15 minutes
    SHORT: 5 * 60 * 1000,    // 5 minutes
    LONG: 30 * 60 * 1000,    // 30 minutes
    EXTENDED: 60 * 60 * 1000 // 1 hour
  },
  
  // CSRF token cache duration (how long to trust cached CSRF tokens)
  CSRF: {
    DEFAULT: 30 * 60 * 1000, // 30 minutes
    SHORT: 15 * 60 * 1000,   // 15 minutes
    LONG: 60 * 60 * 1000,    // 1 hour
    EXTENDED: 2 * 60 * 60 * 1000 // 2 hours
  },
  
  // User data cache duration (how long to trust cached user data)
  USER: {
    DEFAULT: 10 * 60 * 1000, // 10 minutes
    SHORT: 2 * 60 * 1000,    // 2 minutes
    LONG: 20 * 60 * 1000     // 20 minutes
  }
} as const;

// Cache configuration for different environments
export const CACHE_CONFIG = {
  development: {
    auth: CACHE_DURATIONS.AUTH.SHORT,    // Shorter cache in development for testing
    csrf: CACHE_DURATIONS.CSRF.SHORT,
    user: CACHE_DURATIONS.USER.SHORT
  },
  production: {
    auth: CACHE_DURATIONS.AUTH.DEFAULT,  // Standard cache in production
    csrf: CACHE_DURATIONS.CSRF.DEFAULT,
    user: CACHE_DURATIONS.USER.DEFAULT
  },
  testing: {
    auth: CACHE_DURATIONS.AUTH.SHORT,    // Very short cache for testing
    csrf: CACHE_DURATIONS.CSRF.SHORT,
    user: CACHE_DURATIONS.USER.SHORT
  }
} as const;

// Helper function to get cache duration based on environment
export const getCacheDuration = (type: 'auth' | 'csrf' | 'user') => {
  const env = process.env.NODE_ENV || 'development';
  return CACHE_CONFIG[env as keyof typeof CACHE_CONFIG]?.[type] || CACHE_DURATIONS[type.toUpperCase() as keyof typeof CACHE_DURATIONS].DEFAULT;
};
