export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  let errorCount = 0;
  let lastErrorTime = 0;
  
  const handleVueError = (error: Error, instance: any, info: string) => {
    errorCount++;
    lastErrorTime = Date.now();
    if (
      error.message.includes('Cannot read properties of null') ||
      error.message.includes('nextSibling') ||
      error.message.includes('insertBefore') ||
      error.message.includes('nodeType') ||
      error.message.includes('emitsOptions') ||
      error.message.includes('exposed')
    ) {
      return false;
    }
    return true;
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason as any;
    const msg = reason?.message as string | undefined;
    if (
      msg && (
        msg.includes('Cannot read properties of null') ||
        msg.includes('nextSibling') ||
        msg.includes('insertBefore') ||
        msg.includes('nodeType') ||
        msg.includes('emitsOptions') ||
        msg.includes('exposed')
      )
    ) {
      event.preventDefault();
    }
  };

  if (process.client) {
    if (nuxtApp.vueApp?.config) {
      nuxtApp.vueApp.config.errorHandler = handleVueError;
    }
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
  }

  nuxtApp.hook('app:unmount', () => {
    if (process.client) {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    }
  });
});
