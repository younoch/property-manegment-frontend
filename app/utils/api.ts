import { useApiConfig } from '../composables/useApiConfig';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Utility class for making API requests (both public and protected)
 */
export class ApiClient {
  private config: ReturnType<typeof useApiConfig>;

  constructor() {
    this.config = useApiConfig();
  }

  /**
   * Make a GET request to a public endpoint
   */
  async get<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    const { API_CONFIG } = this.config;
    return await $fetch<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      ...options
    });
  }

  /**
   * Make a POST request to a public endpoint
   */
  async post<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    const { API_CONFIG } = this.config;
    return await $fetch<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: data,
      ...options
    });
  }

  /**
   * Make a PUT request to a public endpoint
   */
  async put<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    const { API_CONFIG } = this.config;
    return await $fetch<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: data,
      ...options
    });
  }

  /**
   * Make a PATCH request to a public endpoint
   */
  async patch<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    const { API_CONFIG } = this.config;
    return await $fetch<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: data,
      ...options
    });
  }

  /**
   * Make a DELETE request to a public endpoint
   */
  async delete<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    const { API_CONFIG } = this.config;
    return await $fetch<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      ...options
    });
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
  
  return await $fetch<T>(`${config.API_CONFIG.BASE_URL}${endpoint}`, {
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
  const { useCsrf } = await import('../composables/useCsrf');
  const csrf = useCsrf();
  const config = useApiConfig();
  
  return await csrf.protectedRequest<T>(`${config.API_CONFIG.BASE_URL}${endpoint}`, options);
};

/**
 * Protected API client that requires CSRF tokens
 */
export class ProtectedApiClient {
  private apiClient: ApiClient;
  
  constructor() {
    this.apiClient = new ApiClient();
  }
  
  async get<T>(endpoint: string): Promise<T> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        // Use CSRF protection if token is available
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<T>(`${config.BASE_URL}${endpoint}`, { method: 'GET' });
      } else {
        // Fallback to regular API call if no CSRF token
        console.warn('CSRF token not available, falling back to regular API call');
        return await this.apiClient.get<T>(endpoint);
      }
    } catch (error) {
      console.warn('CSRF request failed, falling back to regular API call:', error);
      return await this.apiClient.get<T>(endpoint);
    }
  }
  
  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        // Use CSRF protection if token is available
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<T>(`${config.BASE_URL}${endpoint}`, { 
          method: 'POST',
          body: JSON.stringify(data)
        });
      } else {
        // Fallback to regular API call if no CSRF token
        console.warn('CSRF token not available, falling back to regular API call');
        return await this.apiClient.post<T>(endpoint, data);
      }
    } catch (error) {
      console.warn('CSRF request failed, falling back to regular API call:', error);
      return await this.apiClient.post<T>(endpoint, data);
    }
  }
  
  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        // Use CSRF protection if token is available
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<T>(`${config.BASE_URL}${endpoint}`, { 
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        // Fallback to regular API call if no CSRF token
        console.warn('CSRF token not available, falling back to regular API call');
        return await this.apiClient.put<T>(endpoint, data);
      }
    } catch (error) {
      console.warn('CSRF request failed, falling back to regular API call:', error);
      return await this.apiClient.put<T>(endpoint, data);
    }
  }
  
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        // Use CSRF protection if token is available
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<T>(`${config.BASE_URL}${endpoint}`, { 
          method: 'PATCH',
          body: JSON.stringify(data)
        });
      } else {
        // Fallback to regular API call if no CSRF token
        console.warn('CSRF token not available, falling back to regular API call');
        return await this.apiClient.patch<T>(endpoint, data);
      }
    } catch (error) {
      console.warn('CSRF request failed, falling back to regular API call:', error);
      return await this.apiClient.patch<T>(endpoint, data);
    }
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        // Use CSRF protection if token is available
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<T>(`${config.BASE_URL}${endpoint}`, { method: 'DELETE' });
      } else {
        // Fallback to regular API call if no CSRF token
        console.warn('CSRF token not available, falling back to regular API call');
        return await this.apiClient.delete<T>(endpoint);
      }
    } catch (error) {
      console.warn('CSRF request failed, falling back to regular API call:', error);
      return await this.apiClient.delete<T>(endpoint);
    }
  }
}

/**
 * Create a new instance of the protected API client
 */
export const createProtectedApiClient = () => new ProtectedApiClient();
