import { useCsrf } from '~/composables/useCsrf'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { getToken, refreshToken } = useCsrf();
  const { isAuthenticated } = useAuth();

  // Auto-refresh CSRF token every 23 hours (before 24h expiry)
  let refreshInterval: NodeJS.Timeout | null = null;

  const startTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(async () => {
      // Check authentication state each time instead of watching
      if (isAuthenticated.value) {
        await refreshToken();
      }
    }, 23 * 60 * 60 * 1000); // 23 hours
  };

  const stopTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  // Handle page visibility changes to refresh token when tab becomes visible
  // Note: This is now handled by the token manager with intelligent timing
  if (process.client) {
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && isAuthenticated.value) {
        // Let token manager handle the refresh timing
        // await refreshToken();
      }
    });
  }

  // Cleanup on app unmount
  nuxtApp.hook('app:unmount', () => {
    stopTokenRefresh();
  });

  // Provide CSRF utilities globally
  return {
    provide: {
      csrf: {
        getToken,
        refreshToken,
        startTokenRefresh,
        stopTokenRefresh
      }
    }
  };
});
