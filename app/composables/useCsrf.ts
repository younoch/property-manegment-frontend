import { getCacheDuration } from '@/constants/cache';

export interface CsrfState {
  token: string | null;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
  cacheDuration: number;
}

export const useCsrf = () => {
  const token = useState<string | null>('csrf-token', () => null);
  const loading = useState<boolean>('csrf-loading', () => false);
  const error = useState<string | null>('csrf-error', () => null);
  const lastFetch = useState<Date | null>('csrf-last-fetch', () => null);
  const cacheDuration = useState<number>('csrf-cache-duration', () => getCacheDuration('csrf'));
  const inFlight = useState<boolean>('csrf-inflight', () => false);
  const backoffUntil = useState<number | null>('csrf-backoff-until', () => null);

  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false;
    const now = new Date();
    return now.getTime() - lastFetch.value.getTime() < cacheDuration.value;
  });

  const isBackoffActive = () => backoffUntil.value != null && Date.now() < backoffUntil.value;

  const hasToken = computed(() => !!token.value || !!lastFetch.value);

  const getToken = async (force: boolean = false): Promise<string | null> => {
    if (process.server) return null;

    try {
      const { useAuth } = await import('./useAuth');
      const auth = useAuth();
      if (!auth.isAuthenticated.value) {
        if (token.value) return token.value;
        return null;
      }
    } catch {}

    if (!force && isBackoffActive()) return null;

    if (token.value && !force && isCacheValid.value) return token.value;

    if (!token.value && isCacheValid.value) lastFetch.value = null;

    if (inFlight.value) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return token.value;
    }

    loading.value = true;
    error.value = null;
    inFlight.value = true;

    try {
      const { tokenManager } = await import('@/services/tokenManager');
      const maybeExisting = tokenManager.getCsrfTokenValue();
      if (maybeExisting && !force) {
        token.value = maybeExisting;
        lastFetch.value = new Date();
        backoffUntil.value = null;
        return maybeExisting;
      }

      const fetched = await tokenManager.getCsrfToken();
      if (fetched) {
        token.value = fetched;
        lastFetch.value = new Date();
        backoffUntil.value = null;
        return fetched;
      }

      // Cookie-based success without explicit token body
      lastFetch.value = new Date();
      backoffUntil.value = null;
      return null;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to get CSRF token';
      const status = err?.status || err?.response?.status;
      
      // If we get a 401/403 error, try to refresh the token first
      if (status === 401 || status === 403) {

        try {
          const refreshResult = await refreshToken();
          if (refreshResult) {

            const { tokenManager } = await import('@/services/tokenManager');
            const retried = await tokenManager.getCsrfToken();
            if (retried) {
              token.value = retried;
              lastFetch.value = new Date();
              backoffUntil.value = null;
              return retried;
            }
          }
        } catch (refreshError) {
          // If refresh fails, force navigation to login page
          await handleAuthFailure();
        }
      }
      
      backoffUntil.value = Date.now() + (status === 401 || status === 403 ? 60_000 : 10_000);
      return null;
    } finally {
      loading.value = false;
      inFlight.value = false;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    if (isBackoffActive()) return null;

    loading.value = true;
    error.value = null;

    try {

      const { tokenManager } = await import('@/services/tokenManager');
      const ok = await tokenManager.refreshCsrfToken();
      if (ok) {
        const value = tokenManager.getCsrfTokenValue();
        if (value) {
          token.value = value;
        }
        lastFetch.value = new Date();
        backoffUntil.value = null;
        return token.value;
      }
      return token.value;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to refresh CSRF token';
      
      if (err?.status === 401) {

        token.value = null;
        lastFetch.value = null;
        backoffUntil.value = Date.now() + 60_000;
        return await getToken();
      }
      
      return null;
    } finally {
      loading.value = false;
    }
  };



  const clearToken = () => {
    token.value = null;
    error.value = null;
    lastFetch.value = null;
    backoffUntil.value = null;
  };

  const setCacheDuration = (duration: number) => {
    cacheDuration.value = duration;
  };

  const forceRefresh = async () => {
    return await getToken(true);
  };

  const clearCache = () => {
    lastFetch.value = null;
  };

  const handleAuthFailure = async () => {

    
    // Clear all tokens and state
    clearToken();
    
    try {
      // Clear user store
      const { useUserStore } = await import('@/stores/user');
      const userStore = useUserStore();
      userStore.setUser(null);
      userStore.persistToStorage();
      
      // Clear auth store
      const { useAuthStore } = await import('@/stores/auth');
      const authStore = useAuthStore();
      authStore.clearError();
      authStore.clearCaches();
      
      // Force navigation to login page
      if (process.client) {
        const { navigateTo } = await import('nuxt/app');
        await navigateTo('/auth/login');
      }
    } catch (error) {
    // Fallback: force page reload to login
    if (process.client) {
        window.location.href = '/auth/login';
      }
    }
  };

  return {
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    hasToken: readonly(hasToken),
    isCacheValid: readonly(isCacheValid),
    lastFetch: readonly(lastFetch),
    cacheDuration: readonly(cacheDuration),

    getToken,
    refreshToken,
    clearToken,
    setCacheDuration,
    forceRefresh,
    clearCache,
    handleAuthFailure
  };
};
