// Environment-based API configuration
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Development: Different ports to simulate different hosting
  if (isDevelopment) {
    const frontendPort = process.env.NUXT_PUBLIC_FRONTEND_PORT || '3000';
    const backendPort = process.env.NUXT_PUBLIC_BACKEND_PORT || '8000';
    const isSamePort = frontendPort === backendPort;
    
    if (isSamePort) {
      // Same port development (simplest)
      return {
        BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
        COOKIE_DOMAIN: 'localhost',
        COOKIE_SECURE: false,
        COOKIE_SAME_SITE: 'lax' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: false
      };
    } else {
      // Different ports development (simulating different hosting)
      return {
        BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
        COOKIE_DOMAIN: 'localhost',
        COOKIE_SECURE: false,
        COOKIE_SAME_SITE: 'lax' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: true
      };
    }
  }
  
  // Production: Flexible configuration
  if (isProduction) {
    const frontendDomain = process.env.NUXT_PUBLIC_FRONTEND_DOMAIN || 'yourapp.com';
    const backendDomain = process.env.NUXT_PUBLIC_BACKEND_DOMAIN || 'api.yourapp.com';
    
    // Extract domain from full URLs if they contain protocol
    const cleanFrontendDomain = frontendDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const cleanBackendDomain = backendDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Check if same domain hosting
    const isSameDomain = cleanFrontendDomain === cleanBackendDomain || 
                        cleanBackendDomain.includes(cleanFrontendDomain) ||
                        cleanFrontendDomain.includes(cleanBackendDomain);
    
    if (isSameDomain) {
      // Same domain hosting - cookies work perfectly
      return {
        BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || `https://${cleanBackendDomain}`,
        COOKIE_DOMAIN: `.${cleanFrontendDomain}`,
        COOKIE_SECURE: true,
        COOKIE_SAME_SITE: 'strict' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: false
      };
    } else {
      // Different domains - need cross-origin cookies
      return {
        BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || `https://${cleanBackendDomain}`,
        COOKIE_DOMAIN: cleanFrontendDomain,
        COOKIE_SECURE: true,
        COOKIE_SAME_SITE: 'none' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: true
      };
    }
  }
  
  // Fallback
  return {
    BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    COOKIE_DOMAIN: 'localhost',
    COOKIE_SECURE: false,
    COOKIE_SAME_SITE: 'lax' as const,
    CORS_CREDENTIALS: true,
    IS_CROSS_ORIGIN: false
  };
};

export const API_CONFIG = getApiConfig();


// API endpoints according to backend specification
export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    REFRESH: '/auth/refresh',
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
