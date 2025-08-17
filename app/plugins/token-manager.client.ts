export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (process.server) return;

  try {
    // Initialize token manager
    const { tokenManager } = await import('../services/tokenManager');
    const { $fetch } = await import('ofetch');
    
    // Get initial CSRF token only if already authenticated (proactive fetch on boot)
    const { useAuth } = await import('../composables/useAuth');
    const auth = useAuth();
    if (auth.isAuthenticated.value) {
      await tokenManager.getCsrfToken();
    }

    // Global response hook to capture X-CSRF-Token from any response
    if (process.client) {
      const nuxtApp = useNuxtApp();
      nuxtApp.hook('app:created', () => {
        // Patch ofetch globally if available via $fetch
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
          // Replace global $fetch with wrapped instance
          (globalThis as any).$fetch = wrapped;
        }
      });
    }

  } catch (error) {
    console.error('❌ Failed to initialize Token Manager:', error);
  }
});
