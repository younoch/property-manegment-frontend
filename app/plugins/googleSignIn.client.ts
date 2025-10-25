// This plugin initializes Google Identity Services for authentication
declare global {
  interface Window {
    google: any;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const googleClientId = config.public.googleClientId;
  
  // Only run on client-side
  if (process.client) {
    // Remove any existing script to prevent multiple initializations
    const existingScript = document.querySelector('script[src^="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (!window.google?.accounts) {
        console.error('Google Identity Services not loaded properly');
        return;
      }
      
      // Initialize the Google Sign-In client
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        auto_select: false,
        cancel_on_tap_outside: false
      });
      
      console.log('Google Identity Services initialized in plugin');
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Google Identity Services script:', error);
    };
    
    document.head.appendChild(script);
  }
  
  // Provide helper methods for components
  return {
    provide: {
      googleSignIn: {
        // This can be used to manually initialize the Google Sign-In button
        renderButton: (element: HTMLElement, options: any) => {
          if (window.google?.accounts) {
            window.google.accounts.id.renderButton(element, options);
          } else {
            console.warn('Google Sign-In not available. Make sure the script is loaded.');
          }
        },
        // This can be used to trigger the One Tap UI
        prompt: (callback: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => {
          if (window.google?.accounts) {
            window.google.accounts.id.prompt(callback);
          } else {
            console.warn('Google Sign-In not available. Make sure the script is loaded.');
          }
        }
      }
    }
  };
});
