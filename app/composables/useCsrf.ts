import { createApiClient } from '../utils/api';

export interface CsrfState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useCsrf = () => {
  const token = useState<string | null>('csrf-token', () => null);
  const loading = useState<boolean>('csrf-loading', () => false);
  const error = useState<string | null>('csrf-error', () => null);
  
  const apiClient = createApiClient();

  // Get CSRF token from backend
  const getToken = async (): Promise<string | null> => {
    if (token.value) return token.value;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get<any>('/csrf/token');
      
      // Extract token from response - handle different response formats
      let csrfToken: string;
      
      if (response && typeof response === 'object') {
        // Try different possible token field names
        if ('token' in response && response.token) {
          csrfToken = response.token;
        } else if ('csrf_token' in response && response.csrf_token) {
          csrfToken = response.csrf_token;
        } else if ('csrfToken' in response && response.csrfToken) {
          csrfToken = response.csrfToken;
        } else if ('value' in response && response.value) {
          csrfToken = response.value;
        } else {
          // No token found, but don't fail - just return null
          console.warn('CSRF token not found in response, continuing without CSRF protection');
          return null;
        }
      } else if (typeof response === 'string' && response.length > 0) {
        // Response is a direct string token
        csrfToken = response;
      } else {
        // No valid response, continue without CSRF
        console.warn('Invalid CSRF token response, continuing without CSRF protection');
        return null;
      }
      
      token.value = csrfToken;
      return csrfToken;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to get CSRF token';
      console.warn('CSRF token fetch failed, continuing without CSRF protection:', err);
      
      // Don't throw error, just return null and let the app continue
      // CSRF is not critical for basic functionality
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Refresh CSRF token
  const refreshToken = async (): Promise<string | null> => {
    if (!token.value) {
      return await getToken();
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.post<any>('/csrf/refresh', null, {
        headers: {
          'X-CSRF-Token': token.value
        }
      });
      
      let newToken: string;
      if (response && typeof response === 'object' && 'token' in response) {
        newToken = response.token;
      } else {
        throw new Error('New CSRF token not found in response');
      }
      
      token.value = newToken;
      return newToken;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to refresh CSRF token';
      console.error('CSRF token refresh error:', err);
      
      // If refresh fails, try to get a new token
      if (err.status === 401) {
        token.value = null;
        return await getToken();
      }
      
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Make a protected request with CSRF token
  const protectedRequest = async <T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    // Ensure we have a token
    if (!token.value) {
      await getToken();
    }
    
    if (!token.value) {
      throw new Error('No CSRF token available');
    }
    
    const response = await $fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token.value,
        ...options.headers
      }
    });
    
    return response;
  };

  // Clear CSRF token (useful for logout)
  const clearToken = () => {
    token.value = null;
    error.value = null;
  };

  // Check if token is available
  const hasToken = computed(() => !!token.value);

  return {
    // State
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    hasToken: readonly(hasToken),
    
    // Methods
    getToken,
    refreshToken,
    protectedRequest,
    clearToken
  };
};
