// Configuration Example
// Copy this file to your project and rename it to match your needs

export const ENV_CONFIG = {
  // Backend API Configuration
  API: {
    // Backend API base URL - update this to match your backend
    BASE_URL: 'http://localhost:8000',
    
    // Optional: Override default port
    PORT: 3000,
    
    // Optional: Environment
    NODE_ENV: 'development'
  },
  
  // Authentication Configuration
  AUTH: {
    // Session timeout (in milliseconds)
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    
    // Token refresh interval (in milliseconds)
    REFRESH_INTERVAL: 15 * 60 * 1000 // 15 minutes
  }
};

// To use environment variables, create a .env file in your project root:
/*
# .env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
NUXT_PORT=3000
NODE_ENV=development
*/
