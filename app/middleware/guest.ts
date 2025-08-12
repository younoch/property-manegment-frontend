export default defineNuxtRouteMiddleware(async (to) => {
  // Avoid SSR execution to prevent loops
  if (import.meta.server) {
    return;
  }

  const { checkAuth } = useAuth();
  const userStore = useUserStore();
  
  // If already authenticated, redirect to dashboard
  if (userStore.isLoggedIn) {
    return navigateTo('/dashboard');
  }
  
  // For auth pages, check if user is authenticated and redirect to dashboard
  if (to.path.startsWith('/auth/')) {
    const result = await checkAuth();
    if (result?.success) {
      return navigateTo('/dashboard');
    }
    return;
  }
});
