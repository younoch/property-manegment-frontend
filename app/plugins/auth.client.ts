import { useAuth } from '~/composables/useAuth'
export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  const { initialize, isAuthCacheValid } = useAuth();
  
  const waitForUI = async () => {
    const ready = nuxtApp.$uiReady?.() || false;
    if (!ready) {
      await nuxtApp.$waitForUI?.();
    }
  };
  
  nuxtApp.hook('page:finish', async () => {
    try {
      await waitForUI();
      const currentRoute = nuxtApp.$router?.currentRoute?.value;
      if (currentRoute?.path?.startsWith('/auth/')) return;
      if (!isAuthCacheValid) {
        await initialize();
      }
    } catch {}
  });

  nuxtApp.hook('app:onBeforeMount', async () => {
    try {
      await waitForUI();
      const currentRoute = nuxtApp.$router?.currentRoute?.value;
      if (currentRoute?.path?.startsWith('/auth/')) return;
      if (!isAuthCacheValid) {
        await initialize();
      }
    } catch {}
  });
});
