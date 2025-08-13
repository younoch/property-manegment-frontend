export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  // Avoid running authentication checks on server during SSR
  if (import.meta.server) {
    return;
  }

  // Ensure we're on the client side and DOM is ready
  if (process.server || !process.client) {
    return;
  }

  // Wait briefly for hydration when applicable
  if (typeof window !== 'undefined' && (window as any).__NUXT__ && !(window as any).__NUXT__.isHydrating) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  try {
    const { checkAuth } = useAuth();
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const csrf = useCsrf();
    
    // Don't check auth on auth pages
    if (to.path.startsWith('/auth/')) {
      return;
    }
    
    // Only validate session if cache is invalid or user is not logged in
    if (!authStore.isAuthCacheValid || !userStore.isLoggedIn) {
      await checkAuth();
    }
    
    // If not authenticated, redirect to login
    if (!userStore.isLoggedIn) {
      return navigateTo('/auth/login');
    }
    
    // Only fetch CSRF token if cache is invalid and user is logged in
    if (userStore.isLoggedIn && !csrf.hasToken.value && !csrf.isCacheValid.value) {
      try {
        await csrf.getToken();
      } catch {
        // proceed without CSRF; required only for protected mutations
      }
    }
  } catch {
    // Don't block navigation on middleware errors
  }
});

export const requireRole = (allowedRoles: string[]) => {
  return defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
    if (import.meta.server) {
      return;
    }

    if (process.server || !process.client) {
      return;
    }

    if (typeof window !== 'undefined' && (window as any).__NUXT__ && !(window as any).__NUXT__.isHydrating) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      const { checkAuth } = useAuth();
      const authStore = useAuthStore();
      const userStore = useUserStore();
      const csrf = useCsrf();
      
      if (to.path.startsWith('/auth/')) {
        return;
      }
      
      if (!authStore.isAuthCacheValid || !userStore.isLoggedIn) {
        await checkAuth();
      }
      
      if (!userStore.currentUser || !allowedRoles.includes(userStore.currentUser.role)) {
        return navigateTo('/unauthorized');
      }

      if (!csrf.hasToken.value && !csrf.isCacheValid.value) {
        try {
          await csrf.getToken();
        } catch {
          return navigateTo('/auth/login');
        }
      }
    } catch {
      // Don't block navigation on middleware errors
    }
  });
};
