export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  let uiComponentsReady = false;
  const { initFromStorage } = useThemeColor()
  initFromStorage()
  
  const waitForUIComponents = async () => {
    if (uiComponentsReady) return;
    await new Promise(resolve => setTimeout(resolve, 300));
    if (typeof window !== 'undefined') {
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', () => resolve(undefined));
        });
      }
      if ((window as any).__NUXT__) {
        await new Promise(resolve => {
          const checkReady = () => {
            const nuxtState = (window as any).__NUXT__;
            if (nuxtState && !nuxtState.isHydrating) resolve(undefined);
            else setTimeout(checkReady, 50);
          };
          checkReady();
        });
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    uiComponentsReady = true;
  };

  nuxtApp.hook('app:mounted', async () => {
    await waitForUIComponents();
  });

  nuxtApp.hook('page:finish', async () => {
    await waitForUIComponents();
  });

  return {
    provide: {
      uiReady: () => uiComponentsReady,
      waitForUI: async () => {
        await waitForUIComponents();
        return uiComponentsReady;
      }
    }
  };
});
