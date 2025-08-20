import { useRuntimeConfig } from '#imports';
export const useApiConfig = () => {
  const runtimePublic = useRuntimeConfig().public as unknown as {
    apiBase?: string;
    apiBaseUrl?: string;
    frontendDomain?: string;
    backendDomain?: string;
  };

  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  const computeConfig = () => {
    // Always prefer BASE_URL from runtime config (env-driven)
    const envBaseUrl = (runtimePublic.apiBase && runtimePublic.apiBase.length > 0)
      ? runtimePublic.apiBase
      : (runtimePublic.apiBaseUrl && runtimePublic.apiBaseUrl.length > 0)
      ? runtimePublic.apiBaseUrl
      : undefined;

    if (envBaseUrl) {
      return {
        BASE_URL: envBaseUrl,
        COOKIE_DOMAIN: isProduction ? (runtimePublic.frontendDomain || 'yourapp.com') : 'localhost',
        COOKIE_SECURE: !!isProduction,
        COOKIE_SAME_SITE: (isProduction ? 'strict' : 'lax'),
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: true
      };
    }

    // Fallbacks if API base not provided explicitly
    if (isDevelopment) {
      return {
        BASE_URL: 'http://localhost:8000',
        COOKIE_DOMAIN: 'localhost',
        COOKIE_SECURE: false,
        COOKIE_SAME_SITE: 'lax' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: true
      };
    }

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
        COOKIE_SAME_SITE: 'strict' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: frontendDomain !== backendDomain
      };
    }

    // Generic fallback
    return {
      BASE_URL: 'http://localhost:3000',
      COOKIE_DOMAIN: 'localhost',
      COOKIE_SECURE: false,
      COOKIE_SAME_SITE: 'lax' as const,
      CORS_CREDENTIALS: true,
      IS_CROSS_ORIGIN: false
    };
  };

  const API_CONFIG = computeConfig();
  return { API_CONFIG };
};
