// Configuration Example
// Copy this file to your project and rename it to match your needs

export const ENV_CONFIG = {
  API: {
    BASE_URL: 'http://localhost:8000',
    PORT: 3000,
    NODE_ENV: 'development'
  },
  
  AUTH: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
    REFRESH_INTERVAL: 15 * 60 * 1000,
  }
};

// To use environment variables, create a .env file in your project root:
/*
# .env
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
NUXT_PORT=3000
NODE_ENV=development
*/
