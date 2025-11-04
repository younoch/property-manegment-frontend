import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToast, useRuntimeConfig } from '#imports';
import { useRouter } from 'vue-router';

declare global {
  interface Window {
    google: any;
  }
}

export function useGoogleSignIn() {
  const authStore = useAuthStore();
  const toast = useToast();
  const router = useRouter();
  const navigateTo = router.push;
  const config = useRuntimeConfig();

  const googleButton = ref<HTMLElement | null>(null);
  const loadingGoogle = ref(false);

  /** Load Google Identity Services script */
  const init = () => {
    if (typeof window === 'undefined') return;

    if (document.querySelector('script[src^="https://accounts.google.com/gsi/client"]')) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => console.log('Google Identity Services loaded');
    script.onerror = (err) => console.error('Failed to load GSI', err);

    document.head.appendChild(script);
  };

  /** Render Google Sign-In button */
  const renderButton = (element: HTMLElement, options: any = {}) => {
    if (!window.google?.accounts || !element) return;
    const defaultOptions = {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: 300,
      ...options
    };
    window.google.accounts.id.renderButton(element, defaultOptions);
  };

  /** Handle OAuth2 token flow */
  const handleButtonClick = () => {
    const clientId = config.public.googleClientId;
    if (!clientId) {
      toast.add({
        title: 'Configuration Error',
        description: 'Google Sign-In is not configured.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle',
        duration: 5000
      });
      return;
    }

    if (!window.google?.accounts) {
      toast.add({
        title: 'Error',
        description: 'Google Sign-In not available.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle',
        duration: 5000
      });
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile',
      callback: async (response: any) => {
        if (response.access_token) {
          try {
            loadingGoogle.value = true;
            const result = await authStore.signInWithGoogle({
              token: response.access_token
            });
            if (result.success) {
              toast.add({
                title: 'Success',
                description: 'Successfully signed in with Google',
                color: 'success',
                icon: 'i-heroicons-check-circle',
                duration: 3000
              });
              navigateTo('/app/dashboard');
            } else {
              throw new Error(result.error || 'Authentication failed');
            }
          } catch (error: any) {
            console.error('Google Sign-In error', error);
            toast.add({
              title: 'Sign in failed',
              description: error?.message || 'Please try again.',
              color: 'error',
              icon: 'i-heroicons-exclamation-circle',
              duration: 5000
            });
          } finally {
            loadingGoogle.value = false;
          }
        }
      },
      error_callback: (err: any) => {
        if (err.error !== 'popup_closed_by_user') {
          toast.add({
            title: 'Sign in failed',
            description: 'There was an error signing in with Google.',
            color: 'error',
            icon: 'i-heroicons-exclamation-circle',
            duration: 5000
          });
        }
        loadingGoogle.value = false;
      }
    });

    client.requestAccessToken();
  };

  /** Initialize on mount */
  onMounted(() => {
    init();
  });

  return {
    googleButton,
    loadingGoogle,
    init,
    renderButton,
    handleButtonClick
  };
}
