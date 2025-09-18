// @ts-nocheck
import { useUserStore } from '../stores/user';

export default defineNuxtRouteMiddleware(async (to: { path: string }) => {
  // Skip middleware on server-side
  if (process.server) return;
  
  // Skip for auth routes
  if (to.path.startsWith('/auth/')) return;
  
  const userStore = useUserStore();
  
  // If we're already authenticated, continue
  if (userStore.isLoggedIn) return;
  
  // Try to restore session from localStorage
  try {
    await userStore.initializeFromStorage();
    
    // If we have a valid user in storage, continue
    if (userStore.isLoggedIn) {
      console.log('User session restored from storage');
      return;
    }
    
    // If no valid session, redirect to login
    console.log('No valid session, redirecting to login');
    return navigateTo('/auth/login');
    
  } catch (error) {
    console.error('Error in auth middleware:', error);
    // On error, clear any potentially invalid auth state
    userStore.clearUser();
    userStore.clearStorage();
    return navigateTo('/auth/login');
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
