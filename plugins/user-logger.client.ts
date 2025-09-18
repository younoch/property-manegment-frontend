// This plugin will log user state changes in the browser console
export default defineNuxtPlugin(({ $pinia }: { $pinia: any }) => {
  // Only run on client-side
  if (process.client) {
    console.log('User logger plugin initializing...');
    
    try {
      // Import store inside the client-side check
      const userStore = useUserStore();
      
      // Log initial state with timestamp
      console.log(`[${new Date().toISOString()}] Initial user state:`, {
        user: userStore.user,
        isAuthenticated: userStore.isAuthenticated,
        loading: userStore.loading,
        hasToken: !!localStorage.getItem('auth_token')
      });
      
      // Subscribe to store changes
      const unsubscribe = userStore.$subscribe((mutation: any, state: any) => {
        console.log(`[${new Date().toISOString()}] User store updated:`, {
          mutation,
          state: {
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading
          },
          stack: new Error().stack?.split('\n').slice(1).join('\n')
        });
      });
      
      // Log when the user logs in or out
      watch(() => userStore.isAuthenticated, (newVal, oldVal) => {
        if (newVal !== oldVal) {
          console.log(`[${new Date().toISOString()}] User ${newVal ? 'logged in' : 'logged out'}`);
        }
      });
      
      // Add a global function to check auth state
      (window as any).checkAuth = () => {
        console.log('Current auth state:', {
          user: userStore.user,
          isAuthenticated: userStore.isAuthenticated,
          loading: userStore.loading,
          hasToken: !!localStorage.getItem('auth_token'),
          storeInitialized: !!userStore.user
        });
      };
      
      // Log when the plugin is destroyed
      return () => {
        console.log('User logger plugin destroyed');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error in user logger plugin:', error);
    }
  }
});
