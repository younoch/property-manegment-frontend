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
    if (isDevelopment) {
      const frontendPort = process.env.NUXT_PUBLIC_FRONTEND_PORT || '3000';
      const backendPort = process.env.NUXT_PUBLIC_BACKEND_PORT || '8000';
      const isSamePort = frontendPort === backendPort;

      if (isSamePort) {
        return {
          BASE_URL: runtimePublic.apiBase || runtimePublic.apiBaseUrl || 'http://localhost:3000',
          COOKIE_DOMAIN: 'localhost',
          COOKIE_SECURE: false,
          COOKIE_SAME_SITE: 'lax' as const,
          CORS_CREDENTIALS: true,
          IS_CROSS_ORIGIN: false
        };
      }
      return {
        BASE_URL: runtimePublic.apiBase || runtimePublic.apiBaseUrl || 'http://localhost:8000',
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

      const isSameDomain =
        frontendDomain === backendDomain ||
        backendDomain.includes(frontendDomain) ||
        frontendDomain.includes(backendDomain);

      if (isSameDomain) {
        return {
          BASE_URL: (runtimePublic.apiBase && runtimePublic.apiBase.length > 0)
            ? runtimePublic.apiBase
            : (runtimePublic.apiBaseUrl && runtimePublic.apiBaseUrl.length > 0)
            ? runtimePublic.apiBaseUrl
            : `https://${backendDomain}`,
          COOKIE_DOMAIN: `.${frontendDomain}`,
          COOKIE_SECURE: true,
          COOKIE_SAME_SITE: 'strict' as const,
          CORS_CREDENTIALS: true,
          IS_CROSS_ORIGIN: false
        };
      }
      return {
        BASE_URL: (runtimePublic.apiBase && runtimePublic.apiBase.length > 0)
          ? runtimePublic.apiBase
          : (runtimePublic.apiBaseUrl && runtimePublic.apiBaseUrl.length > 0)
          ? runtimePublic.apiBaseUrl
          : `https://${backendDomain}`,
        COOKIE_DOMAIN: frontendDomain,
        COOKIE_SECURE: true,
        COOKIE_SAME_SITE: 'none' as const,
        CORS_CREDENTIALS: true,
        IS_CROSS_ORIGIN: true
      };
    }

    return {
      BASE_URL: runtimePublic.apiBase || runtimePublic.apiBaseUrl || 'http://localhost:3000',
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
