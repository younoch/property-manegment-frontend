// This plugin initializes Google Identity Services for authentication with FedCM support
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

    // Load the Google Identity Services script with FedCM support
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (!window.google?.accounts) {
        console.error('Google Identity Services not loaded properly');
        return;
      }
      
      // Initialize the Google Sign-In client with FedCM support
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            // This will be handled by the component
            console.log('Google Sign-In callback received');
          },
          auto_select: false,
          cancel_on_tap_outside: false,
          // Enable FedCM support
          use_fedcm_for_prompt: true,
          // Disable legacy One Tap API
          itp_support: false
        });
        
        console.log('Google Identity Services initialized with FedCM support');
      } catch (error) {
        console.error('Error initializing Google Identity Services:', error);
      }
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
        // Initialize and render the Google Sign-In button
        renderButton: (element: HTMLElement, options: any = {}) => {
          if (!window.google?.accounts) {
            console.warn('Google Sign-In not available. Make sure the script is loaded.');
            return null;
          }
          
          const defaultOptions = {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 300,
            // Enable FedCM for the button
            use_fedcm_for_prompt: true
          };
          
          return window.google.accounts.id.renderButton(element, { ...defaultOptions, ...options });
        },
        
        // Handle the sign-in response
        handleCredentialResponse: async (response: any) => {
          if (!response.credential) {
            throw new Error('No credential received from Google');
          }
          
          // Here you would typically send the credential to your backend
          // For example:
          try {
            const authStore = useAuthStore();
            const result = await authStore.signInWithGoogle({
              token: response.credential
            });
            
            if (!result.success) {
              throw new Error(result.error || 'Authentication failed');
            }
            
            return result;
          } catch (error) {
            console.error('Error during Google authentication:', error);
            throw error;
          }
        },
        
        // Get the Google Auth2 instance
        getAuthInstance: () => {
          if (!window.google?.accounts) {
            throw new Error('Google Sign-In not available');
          }
          return window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'email profile openid',
          });
        }
      }
    }
  };
});
