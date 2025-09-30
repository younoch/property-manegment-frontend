// This plugin will log user state changes in the browser console
export default defineNuxtPlugin(({ $pinia }: { $pinia: any }) => {
  // Only run on client-side
  if (process.client) {
    try {
      // Import store inside the client-side check
      const userStore = useUserStore();
      
      // Initial state logging removed
      
      // Subscribe to store changes
      // Subscribe to store changes without logging
      const unsubscribe = userStore.$subscribe(() => {});
      
      // Watch for authentication changes without logging
      watch(() => userStore.isAuthenticated, () => {});
      
      // Add a global function to check auth state (no-op in production)
      (window as any).checkAuth = () => {};
      
      // Clean up when the plugin is destroyed
      return () => {
        unsubscribe();
      };
    } catch (error) {
      // Error handling without console output
    }
  }
});
