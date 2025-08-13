export default defineNuxtPlugin(async (nuxtApp) => {
  const { getToken, refreshToken } = useCsrf();
  const { isAuthenticated } = useAuth();

  // Auto-refresh CSRF token every 30 minutes
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
    }, 30 * 60 * 1000); // 30 minutes
  };

  const stopTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  // Handle page visibility changes to refresh token when tab becomes visible
  if (process.client) {
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && isAuthenticated.value) {
        // Refresh token when tab becomes visible
        await refreshToken();
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
