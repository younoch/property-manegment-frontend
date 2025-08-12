export default defineNuxtPlugin(async (nuxtApp) => {
  const { checkAuth } = useAuth();
  const route = useRoute();
  
  // Don't check auth on auth pages (login/register)
  if (route.path.startsWith('/auth/')) {
    return;
  }
  
  // Defer the auth check to next tick to ensure Pinia is hydrated
  await nuxtApp.hook('app:mounted', async () => {
    await checkAuth();
  });
});
