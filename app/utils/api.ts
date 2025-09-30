import { useApiConfig } from '../composables/useApiConfig';
import { useApiToast } from '../composables/useApiToast';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Base API response interface that ensures all responses have a message field
 */
interface ApiResponse<T = any> {
  message: string;
  data?: T;
  [key: string]: any;
}

/**
 * Utility class for making API requests (both public and protected)
 */
export class ApiClient {
  private config: ReturnType<typeof useApiConfig>;

  constructor() {
    this.config = useApiConfig();
  }

  /**
   * Show success toast
   */
  private showSuccessToast(message: string, title?: string) {
    const { success } = useApiToast();
    // Intentionally do not await here to avoid blocking; composable defers until hydrated
    success(message, title);
  }

  /**
   * Show error toast
   */
  private showErrorToast(message: string, title?: string) {
    const { error } = useApiToast();
    error(message, title);
  }

  /**
   * Make a GET request to a public endpoint
   */
  async get<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResponse<T>> {
    try {
      const { API_CONFIG } = this.config;
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'GET',
        credentials: 'include',
        ...options
      });
      // Do not show success toast for GETs to reduce noise and avoid early hydration toasts
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to retrieve data';
      this.showErrorToast(errorMessage);
      throw error;
    }
  }

  /**
   * Make a POST request to a public endpoint
   */
  async post<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResponse<T>> {
    try {
      const { API_CONFIG } = this.config;
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data,
        ...options
      });
      const message = response.message || 'Data created successfully';
      this.showSuccessToast(message);
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create data';
      this.showErrorToast(errorMessage);
      throw error;
    }
  }

  /**
   * Make a PUT request to a public endpoint
   */
  async put<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResponse<T>> {
    try {
      const { API_CONFIG } = this.config;
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data,
        ...options
      });
      const message = response.message || 'Data updated successfully';
      this.showSuccessToast(message);
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update data';
      this.showErrorToast(errorMessage);
      throw error;
    }
  }

  /**
   * Make a PATCH request to a public endpoint
   */
  async patch<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResponse<T>> {
    try {
      const { API_CONFIG } = this.config;
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data,
        ...options
      });
      const message = response.message || 'Data updated successfully';
      this.showSuccessToast(message);
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update data';
      this.showErrorToast(errorMessage);
      throw error;
    }
  }

  /**
   * Make a DELETE request to a public endpoint
   */
  async delete<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<ApiResponse<T>> {
    try {
      const { API_CONFIG } = this.config;
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'DELETE',
        credentials: 'include',
        ...options
      });
      const message = response.message || 'Data deleted successfully';
      this.showSuccessToast(message);
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete data';
      this.showErrorToast(errorMessage);
      throw error;
    }
  }

  /**
   * Get the API configuration
   */
  getApiConfig() {
    return this.config.API_CONFIG;
  }
}

/**
 * Create a new instance of the API client
 */
export const createApiClient = () => new ApiClient();

/**
 * Helper function for making a single public request
 */
export const makeRequest = async <T>(
  endpoint: string,
  options: Omit<RequestInit, 'method'> = {}
): Promise<T> => {
  const config = useApiConfig();
  const url = `${config.API_CONFIG.BASE_URL}${endpoint}`;

  return await $fetch<T>(url, {
    credentials: 'include',
    ...options
  });
};

/**
 * Helper function for making a single protected request
 */
export const makeProtectedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const config = useApiConfig();
  const url = `${config.API_CONFIG.BASE_URL}${endpoint}`;

  // Use the new token manager approach
  const { tokenManager } = await import('../services/tokenManager');
  const method = options.method as HttpMethod || 'GET';
  const csrfHeaders = method !== 'GET' ? tokenManager.getCsrfHeader() : {};
  
  try {
    return await $fetch<T>(url, {
      ...options,
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...csrfHeaders,
        ...options.headers
      }
    });
  } catch (error: any) {
    // Handle 401 errors with specific message-based logic
    if (error?.status === 401) {
      const errorMessage = error?.data?.message || error?.message || '';
      
      // If CSRF-related error, refresh CSRF token first
      if (errorMessage.toLowerCase().includes('csrf')) {
        const csrfOk = await tokenManager.refreshCsrfToken();
        if (csrfOk) {
          try {
            return await $fetch<T>(url, {
              ...options,
              method: method,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                ...tokenManager.getCsrfHeader(),
                ...options.headers
              }
            });
          } catch (retryError: any) {
            throw retryError;
          }
        }
      }
      
      // If JWT/token-related error, refresh JWT token first
      else if (errorMessage.toLowerCase().includes('token')) {
        const jwtOk = await tokenManager.refreshJwtToken();
        if (jwtOk) {
          try {
            return await $fetch<T>(url, {
              ...options,
              method: method,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                ...tokenManager.getCsrfHeader(),
                ...options.headers
              }
            });
          } catch (retryError: any) {
            throw retryError;
          }
        }
      }
    }
    
    // Re-throw the original error if no refresh was attempted or if refresh failed
    throw error;
  }
};

/**
 * Protected API client that requires CSRF tokens
 */
export class ProtectedApiClient {
  private apiClient: ApiClient;
  
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Check if an error indicates token expiration
   */
  private isTokenExpiredError(error: any): boolean {
    const message = error?.data?.message || error?.message || '';
    return message.toLowerCase().includes('access token')
  }

  /**
   * Check if error message indicates CSRF-related issue
   */
  private isCsrfError(error: any): boolean {
    const message = error?.data?.message || error?.message || '';
    return message.toLowerCase().includes('csrf');
  }

  /**
   * Check if error message indicates JWT/token-related issue
   */
  private isJwtError(error: any): boolean {
    const message = error?.data?.message || error?.message || '';
    return message.toLowerCase().includes('token');
  }

  /**
   * Make a protected request with automatic token refresh and retry
   */
  private async makeProtectedRequestWithRetry<T>(
    endpoint: string,
    method: HttpMethod,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config = this.apiClient.getApiConfig();
    const url = `${config.BASE_URL}${endpoint}`;
    
    try {
      // Get CSRF token for state-changing operations
      const { tokenManager } = await import('../services/tokenManager');
      const csrfHeaders = method !== 'GET' ? tokenManager.getCsrfHeader() : {};
      const { headers: optionHeaders, method: _ignoredMethod, ...restOptions } = options || {};

      const response = await $fetch<ApiResponse<T>>(url, {
        ...restOptions,
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders,
          ...optionHeaders
        },
        body: data
      });
      return response;
    } catch (error: any) {
      if (this.isTokenExpiredError(error)) {
        const { tokenManager } = await import('../services/tokenManager');
        
        // Check for specific 401 error messages and handle accordingly
        if (error?.status === 401) {
          const errorMessage = error?.data?.message || error?.message || '';
          
          // If CSRF-related error, refresh CSRF token first
          if (this.isCsrfError(error)) {
                const csrfOk = await tokenManager.refreshCsrfToken();
            if (csrfOk) {
              try {
                const { headers: retryOptionHeaders, method: _ignoredRetryMethod, ...restRetryOptions } = options || {};

                const retryResponse = await $fetch<ApiResponse<T>>(url, {
                  ...restRetryOptions,
                  method: method,
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                    ...tokenManager.getCsrfHeader(),
                    ...retryOptionHeaders
                  },
                  body: data
                });

                return retryResponse;
              } catch (retryAfterCsrfError: any) {
                await this.handleAuthFailure();
                throw retryAfterCsrfError;
              }
            }
          }
          
          // If JWT/token-related error, refresh JWT token first
          else if (this.isJwtError(error)) {
                const jwtOk = await tokenManager.refreshJwtToken();
            if (jwtOk) {
              try {
                const { headers: retryOptionHeaders, method: _ignoredRetryMethod, ...restRetryOptions } = options || {};

                const retryResponse = await $fetch<ApiResponse<T>>(url, {
                  ...restRetryOptions,
                  method: method,
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                    ...tokenManager.getCsrfHeader(),
                    ...retryOptionHeaders
                  },
                  body: data
                });

                return retryResponse;
              } catch (retryAfterJwtError: any) {
                // If still unauthorized/forbidden, try CSRF refresh next
                if (retryAfterJwtError?.status === 401 || retryAfterJwtError?.status === 403) {
                  const csrfOk = await tokenManager.refreshCsrfToken();
                  if (csrfOk) {
                    try {
                      const { headers: retry2OptionHeaders, method: _ignoredRetry2Method, ...restRetry2Options } = options || {};

                      const retry2Response = await $fetch<ApiResponse<T>>(url, {
                        ...restRetry2Options,
                        method: method,
                        credentials: 'include',
                        headers: {
                          'Content-Type': 'application/json',
                          ...tokenManager.getCsrfHeader(),
                          ...retry2OptionHeaders
                        },
                        body: data
                      });

                      return retry2Response;
                    } catch (retryAfterCsrfError: any) {
                      console.error('❌ Request failed after JWT+CSRF refresh:', retryAfterCsrfError);
                      await this.handleAuthFailure();
                      throw retryAfterCsrfError;
                    }
                  }
                }
                console.error('❌ Request failed even after JWT refresh:', retryAfterJwtError);
                await this.handleAuthFailure();
                throw retryAfterJwtError;
              }
            }
          }
          
          // For other 401 errors, try JWT refresh first (existing logic)
          else {
            const jwtOk = await tokenManager.refreshJwtToken();
            if (jwtOk) {
              try {
                const { headers: retryOptionHeaders, method: _ignoredRetryMethod, ...restRetryOptions } = options || {};

                const retryResponse = await $fetch<ApiResponse<T>>(url, {
                  ...restRetryOptions,
                  method: method,
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                    ...tokenManager.getCsrfHeader(),
                    ...retryOptionHeaders
                  },
                  body: data
                });

                return retryResponse;
              } catch (retryAfterJwtError: any) {
                // If still unauthorized/forbidden, try CSRF refresh next
                if (retryAfterJwtError?.status === 401 || retryAfterJwtError?.status === 403) {
                  const csrfOk = await tokenManager.refreshCsrfToken();
                  if (csrfOk) {
                    try {
                      const { headers: retry2OptionHeaders, method: _ignoredRetry2Method, ...restRetry2Options } = options || {};

                      const retry2Response = await $fetch<ApiResponse<T>>(url, {
                        ...restRetry2Options,
                        method: method,
                        credentials: 'include',
                        headers: {
                          'Content-Type': 'application/json',
                          ...tokenManager.getCsrfHeader(),
                          ...retry2OptionHeaders
                        },
                        body: data
                      });

                      return retry2Response;
                    } catch (retryAfterCsrfError: any) {
                      console.error('❌ Request failed after JWT+CSRF refresh:', retryAfterCsrfError);
                      await this.handleAuthFailure();
                      throw retryAfterCsrfError;
                    }
                  }
                }
                console.error('❌ Request failed even after JWT refresh:', retryAfterJwtError);
                await this.handleAuthFailure();
                throw retryAfterJwtError;
              }
            }
          }
        }

        // Stage 2: For initial 403 or if JWT not attempted, try CSRF refresh
        const csrfOk = await tokenManager.refreshCsrfToken();
        if (csrfOk) {
          try {
            const { headers: retryOptionHeaders, method: _ignoredRetryMethod, ...restRetryOptions } = options || {};

            const retryResponse = await $fetch<ApiResponse<T>>(url, {
              ...restRetryOptions,
              method: method,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                ...tokenManager.getCsrfHeader(),
                ...retryOptionHeaders
              },
              body: data
            });

            return retryResponse;
          } catch (retryError: any) {
            await this.handleAuthFailure();
            throw retryError;
          }
        }

        await this.handleAuthFailure();
        throw error;
      }
      throw error;
    }
  }

  /**
   * Handle authentication failure by redirecting to signin
   */
  private async handleAuthFailure() {

    
    try {
      const { tokenManager } = await import('../services/tokenManager');
      tokenManager.clearTokens();
      
      // Clear user store
      const { useUserStore } = await import('../stores/user');
      const userStore = useUserStore();
      userStore.setUser(null);
      userStore.persistToStorage();
      
      // Force navigation to signin page
      if (process.client) {
        const { navigateTo } = await import('nuxt/app');
        await navigateTo('/auth/login');
      }
    } catch (error) {
      // Fallback: force page reload to signin
      if (process.client) {
        window.location.href = '/auth/login';
      }
    }
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return await this.makeProtectedRequestWithRetry<T>(endpoint, 'GET');
  }
  
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return await this.makeProtectedRequestWithRetry<T>(endpoint, 'POST', data);
  }
  
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return await this.makeProtectedRequestWithRetry<T>(endpoint, 'PUT', data);
  }
  
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return await this.makeProtectedRequestWithRetry<T>(endpoint, 'PATCH', data);
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return await this.makeProtectedRequestWithRetry<T>(endpoint, 'DELETE');
  }
}

/**
 * Create a new instance of the protected API client
 */
export const createProtectedApiClient = () => new ProtectedApiClient();
