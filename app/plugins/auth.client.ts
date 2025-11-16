// Lazy load the auth composable
const loadAuth = () => import('~/composables/useAuth').then(m => m.useAuth());

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  // Only initialize auth on client-side and if not on auth pages
  const shouldSkipAuth = () => {
    const route = nuxtApp.$router?.currentRoute?.value;
    return !process.client || route?.path?.startsWith('/auth/');
  };
  
  // Wait for UI to be ready with a timeout
  const waitForUI = async () => {
    if (nuxtApp.$uiReady?.()) return true;
    return nuxtApp.$waitForUI?.() || Promise.resolve();
  };
  
  // Initialize auth only once with retry logic
  let authInitialized = false;
  const initializeAuth = async () => {
    if (authInitialized || shouldSkipAuth()) return;
    
    try {
      const { initialize, isAuthCacheValid } = await loadAuth();
      if (!isAuthCacheValid) {
        await initialize();
        authInitialized = true;
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  };
  
  // Single optimized hook for page navigation
  nuxtApp.hook('page:finish', async () => {
    await waitForUI();
    await initializeAuth();
  });

  // Fallback for initial page load
  if (process.client) {
    waitForUI().then(initializeAuth);
  }
});
