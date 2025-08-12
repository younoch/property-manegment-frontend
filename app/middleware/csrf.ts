export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client side
  if (process.server) return;

  const { isAuthenticated } = useAuth();
  const { getToken, hasToken } = useCsrf();

  // If user is authenticated but doesn't have a CSRF token, get one
  if (isAuthenticated.value && !hasToken.value) {
    try {
      await getToken();
    } catch (error) {
      console.error('Failed to get CSRF token in middleware:', error);
      
      // If we can't get a CSRF token, redirect to login
      // This could happen if the session is invalid
      return navigateTo('/auth/login');
    }
  }
});
