import { useRuntimeConfig } from '#imports';
// Environment-based API configuration (unified with runtime config)
const getApiConfig = () => {
  const runtimePublic = useRuntimeConfig().public as unknown as {
    apiBase?: string;
    apiBaseUrl?: string;
    frontendDomain?: string;
    backendDomain?: string;
  };

  const isProduction = process.env.NODE_ENV === 'production';

  // Prefer env-provided base URL from runtime config
  const baseFromEnv = (runtimePublic.apiBase && runtimePublic.apiBase.length > 0)
    ? runtimePublic.apiBase
    : (runtimePublic.apiBaseUrl && runtimePublic.apiBaseUrl.length > 0)
    ? runtimePublic.apiBaseUrl
    : undefined;

  if (baseFromEnv) {
    return {
      BASE_URL: baseFromEnv,
      COOKIE_DOMAIN: isProduction ? (runtimePublic.frontendDomain || 'yourapp.com') : 'localhost',
      COOKIE_SECURE: !!isProduction,
      COOKIE_SAME_SITE: (isProduction ? 'strict' : 'lax'),
      CORS_CREDENTIALS: true,
      IS_CROSS_ORIGIN: true
    };
  }

  // Fallbacks when no explicit base URL provided
  if (isProduction) {
    const frontendDomain = (runtimePublic.frontendDomain || 'yourapp.com')
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
    const backendDomain = (runtimePublic.backendDomain || 'api.yourapp.com')
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
    return {
      BASE_URL: `https://${backendDomain}`,
      COOKIE_DOMAIN: `.${frontendDomain}`,
      COOKIE_SECURE: true,
      COOKIE_SAME_SITE: 'strict',
      CORS_CREDENTIALS: true,
      IS_CROSS_ORIGIN: frontendDomain !== backendDomain
    };
  }

  return {
    BASE_URL: 'http://localhost:8000',
    COOKIE_DOMAIN: 'localhost',
    COOKIE_SECURE: false,
    COOKIE_SAME_SITE: 'lax',
    CORS_CREDENTIALS: true,
    IS_CROSS_ORIGIN: true
  };
};

export const getRuntimeApiConfig = () => getApiConfig();


// API endpoints according to backend specification
export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    REFRESH: '/csrf/refresh',
    WHOAMI: '/auth/whoami',
    // Optional endpoints (may not exist on backend yet)
    VALIDATE: '/auth/validate',
    STATUS: '/auth/status'
  },
  CSRF: {
    TOKEN: '/csrf/token',
    REFRESH: '/csrf/refresh'
  },
  PROPERTIES: '/properties',
  ACCOUNTS: '/accounts'
};

// Request configuration
export const REQUEST_CONFIG = {
  credentials: 'include' as const,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Cookie configuration for different environments
export const COOKIE_CONFIG = {
  // Development - Same port
  developmentSamePort: {
    domain: 'localhost',
    secure: false,
    sameSite: 'lax' as const,
    httpOnly: false // Allow JavaScript access in dev for debugging
  },
  
  // Development - Different ports (simulating different hosting)
  developmentDifferentPorts: {
    domain: 'localhost',
    secure: false,
    sameSite: 'lax' as const,
    httpOnly: false, // Allow JavaScript access in dev for debugging
    crossOrigin: true
  },
  
  // Production - Same domain
  productionSameDomain: {
    domain: `.${(process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com').replace(/^https?:\/\//, '').replace(/\/$/, '')}`,
    secure: true,
    sameSite: 'strict' as const,
    httpOnly: true // Secure in production
  },
  
  // Production - Different domains
  productionDifferentDomains: {
    domain: (process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    secure: true,
    sameSite: 'none' as const,
    httpOnly: true, // Secure in production
    crossOrigin: true
  }
};

// Cross-origin specific configuration
export const CROSS_ORIGIN_CONFIG = {
  // Frontend domains that can access the backend
  allowedOrigins: [
    (process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    `https://${(process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com').replace(/^https?:\/\//, '').replace(/\/$/, '')}`,
    'http://localhost:3000' // Development
  ],
  
  // Cookie settings for cross-origin
  cookieSettings: {
    sameSite: 'none' as const,
    secure: true,
    httpOnly: true,
    path: '/'
  },
  
  // CORS headers for cross-origin
  corsHeaders: {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '86400' // 24 hours
  }
};
