// @ts-nocheck
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';
import { useAuth } from '~/composables/useAuth';
import { useCsrf } from '~/composables/useCsrf';

// Track if we're already checking auth to prevent duplicate calls
let isCheckingAuth = false;

export default defineNuxtRouteMiddleware(async (to: { path: string }) => {
  // Skip middleware on server-side
  if (process.server) return;
  
  // Skip for auth routes
  if (to.path.startsWith('/auth/')) return;
  
  const userStore = useUserStore();
  const authStore = useAuthStore();
  
  // If we're already authenticated and the cache is valid, continue
  if (userStore.isLoggedIn && authStore.isAuthCacheValid) {
    return;
  }
  
  // Prevent multiple simultaneous auth checks
  if (isCheckingAuth) {
    return;
  }
  
  isCheckingAuth = true;
  
  try {
    // First try to restore from storage (fast path)
    if (!userStore.isLoggedIn) {
      await userStore.initializeFromStorage();
    }
    
    // If we have a valid user in storage and cache is still valid, continue
    if (userStore.isLoggedIn && authStore.isAuthCacheValid) {
      // Refresh the auth state in the background if needed
      if (!authStore.isAuthCacheValid) {
        const { checkAuth } = useAuth();
        checkAuth().catch(console.error);
      }
      return;
    }
    
    // If we don't have a valid session, check with the server
    const { checkAuth } = useAuth();
    const { success } = await checkAuth();
    
    if (!success) {
      // If server check fails, clear any invalid state and redirect to login
      userStore.clearUser();
      userStore.clearStorage();
      return navigateTo('/auth/login');
    }
    
  } catch (error) {
    console.error('Error in auth middleware:', error);
    // On error, clear any potentially invalid auth state
    userStore.clearUser();
    userStore.clearStorage();
    return navigateTo('/auth/login');
  } finally {
    isCheckingAuth = false;
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
