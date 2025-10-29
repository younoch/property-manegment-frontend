import { useUserStore } from '~/stores/user'
import type { RouteLocationNormalized } from 'vue-router'
export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  // Avoid SSR execution to prevent loops
  if (import.meta.server) {
    return;
  }

  const userStore = useUserStore();
  
  // If already authenticated, redirect to dashboard
  if (userStore.isLoggedIn) {

    return navigateTo('/app/dashboard');
  }
  
  // For auth pages, only do a quick check to avoid interfering with login process
  if (to.path.startsWith('/auth/')) {
    // Only check if we have a user in storage, don't make API calls
    // This prevents interference with the login process
    if (userStore.currentUser) {

      return navigateTo('/app/dashboard');
    }
    return;
  }
});
