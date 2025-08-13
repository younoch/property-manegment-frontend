export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  console.log('🔄 CSRF middleware triggered for route:', to.path);
  
  // Only run on client side
  if (process.server) {
    console.log('🔄 Server-side detected, skipping CSRF middleware');
    return;
  }

  // Ensure we're on the client side and DOM is ready
  if (!process.client) {
    console.log('🔄 Not on client side, skipping');
    return;
  }

  // Wait for Vue to be fully hydrated before running middleware
  if (typeof window !== 'undefined' && (window as any).__NUXT__ && !(window as any).__NUXT__.isHydrating) {
    console.log('🔄 Vue not hydrating, waiting 100ms for components to be ready');
    // If not hydrating, wait a bit for components to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('🔄 Wait complete');
  } else {
    console.log('🔄 Vue still hydrating or no Nuxt state, proceeding');
  }

  try {
    console.log('🔄 Setting up CSRF middleware...');
    const { isAuthenticated } = useAuth();
    const { getToken, hasToken, isCacheValid } = useCsrf();
    
    console.log('🔄 CSRF middleware setup complete, checking authentication...');

    // If user is authenticated but doesn't have a CSRF token and cache is invalid, get one
    if (isAuthenticated.value && !hasToken.value && !isCacheValid.value) {
      try {
        console.log('🔄 CSRF cache invalid, fetching new token');
        await getToken();
        console.log('🔄 CSRF token fetch complete');
      } catch (error) {
        console.error('🔄 Failed to get CSRF token in middleware:', error);
        
        // If we can't get a CSRF token, redirect to login
        // This could happen if the session is invalid
        return navigateTo('/auth/login');
      }
    } else if (isAuthenticated.value && hasToken.value && isCacheValid.value) {
      console.log('🔄 CSRF cache valid, skipping token fetch');
    } else {
      console.log('🔄 CSRF middleware conditions not met:', {
        isAuthenticated: isAuthenticated.value,
        hasToken: hasToken.value,
        isCacheValid: isCacheValid.value
      });
    }
    
    console.log('🔄 CSRF middleware execution complete');
  } catch (error) {
    console.error('🔄 Error in CSRF middleware:', error);
    // Don't block navigation on middleware errors
  }
});
