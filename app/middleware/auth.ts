export default defineNuxtRouteMiddleware(async (to) => {
  // Avoid running authentication checks on server during SSR
  if (import.meta.server) {
    console.log('[auth.middleware] SSR run detected, skipping auth check on server');
    return;
  }
  const { checkAuth } = useAuth();
  const userStore = useUserStore();
  const { getToken, hasToken } = useCsrf();
  
    // Don't check auth on auth pages
  if (to.path.startsWith('/auth/')) {
    return;
  }
  
  // Always validate session on navigation to protected routes
  await checkAuth();
  
  // If not authenticated, redirect to login
  if (!userStore.isLoggedIn) {
    return navigateTo('/auth/login');
  }
  
  // Best-effort CSRF token fetch (do not force redirect solely on CSRF failure)
  if (userStore.isLoggedIn && !hasToken.value) {
    try {
      await getToken();
    } catch (error) {
      console.warn('Proceeding without CSRF token; will be required for protected mutations.');
    }
  }
});

// Role-based access control function
export const requireRole = (allowedRoles: string[]) => {
  return defineNuxtRouteMiddleware(async (to) => {
    const { checkAuth } = useAuth();
    const userStore = useUserStore();
    const { getToken, hasToken } = useCsrf();
    
    // Don't check auth on auth pages
    if (to.path.startsWith('/auth/')) {
      return;
    }
    
    // Wait for initial auth check to complete
    await checkAuth();
    
    // Check if user has required role
    if (!userStore.currentUser || !allowedRoles.includes(userStore.currentUser.role)) {
      return navigateTo('/unauthorized');
    }

    // Ensure CSRF token is available for role-protected routes
    if (!hasToken.value) {
      try {
        await getToken();
        } catch (error) {
        console.error('Failed to get CSRF token in role middleware:', error);
        return navigateTo('/auth/login');
      }
    }
  });
};
