export default defineNuxtPlugin(async () => {
  if (process.server) return;

  try {
    const { tokenManager } = await import('@/services/tokenManager');
    const { $fetch } = await import('ofetch');
    
    const { useAuth } = await import('@/composables/useAuth');
    const auth = useAuth();
    if (auth.isAuthenticated.value) {
      await tokenManager.getCsrfToken();
    }

    if (process.client) {
      const nuxtApp = useNuxtApp();
      nuxtApp.hook('app:created', () => {
        const originalFetch = globalThis.$fetch as any;
        if (originalFetch && typeof originalFetch.create === 'function') {
          const wrapped = originalFetch.create({
            onResponse: async ({ response }: any) => {
              const headerToken = response.headers.get('X-CSRF-Token') || response.headers.get('x-csrf-token');
              if (headerToken) {
                tokenManager.setCsrfTokenFromHeader(headerToken);
              }
            }
          });
          (globalThis as any).$fetch = wrapped;
        }
      });
    }

  } catch (error) {
    console.error('❌ Failed to initialize Token Manager:', error);
  }
});
