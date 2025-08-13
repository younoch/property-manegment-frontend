import { createApiClient } from '../utils/api';
import { getCacheDuration } from '../constants/cache';

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

  const apiClient = createApiClient();

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
      const response = await apiClient.get<any>('/csrf/token');

      let csrfToken: string | undefined;
      if (response && typeof response === 'object') {
        if ('token' in response && (response as any).token) csrfToken = (response as any).token as string;
        else if ('csrf_token' in response && (response as any).csrf_token) csrfToken = (response as any).csrf_token as string;
        else if ('csrfToken' in response && (response as any).csrfToken) csrfToken = (response as any).csrfToken as string;
        else if ('value' in response && (response as any).value) csrfToken = (response as any).value as string;
      } else if (typeof response === 'string' && response.length > 0) {
        csrfToken = response;
      }

      if (csrfToken) {
        token.value = csrfToken;
        lastFetch.value = new Date();
        backoffUntil.value = null;
        return csrfToken;
      }

      // Cookie-based flow: treat success as valid via lastFetch
      lastFetch.value = new Date();
      backoffUntil.value = null;
      return null;
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to get CSRF token';
      const status = err?.status || err?.response?.status;
      backoffUntil.value = Date.now() + (status === 401 || status === 403 ? 60_000 : 10_000);
      return null;
    } finally {
      loading.value = false;
      inFlight.value = false;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    if (!token.value) return await getToken();
    if (isBackoffActive()) return null;

    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<any>('/csrf/refresh', null, {
        headers: token.value ? { 'X-CSRF-Token': token.value } : undefined
      });

      let newToken: string | undefined;
      if (response && typeof response === 'object' && 'token' in response) newToken = (response as any).token as string;

      if (newToken) token.value = newToken;
      lastFetch.value = new Date();
      backoffUntil.value = null;
      return newToken || null;
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

  const protectedRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    if (!isCacheValid.value) await getToken();
    const response = await $fetch<T>(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { 'X-CSRF-Token': token.value } : {}),
        ...options.headers
      }
    });
    return response;
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
    protectedRequest,
    clearToken,
    setCacheDuration,
    forceRefresh,
    clearCache
  };
};
