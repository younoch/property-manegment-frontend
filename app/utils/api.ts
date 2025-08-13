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
      const response = await $fetch<ApiResponse<T>>(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
      const response = await $fetch<ApiResponse<T>>(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
      const response = await $fetch<ApiResponse<T>>(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
      const response = await $fetch<ApiResponse<T>>(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
      const response = await $fetch<ApiResponse<T>>(`${API_CONFIG.BASE_URL}${endpoint}`, {
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
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        const config = this.apiClient.getApiConfig();
        // Do not toast on protected GETs to reduce noise/hydration load
        return await csrf.protectedRequest<ApiResponse<T>>(`${config.BASE_URL}${endpoint}`, { method: 'GET' });
      } else {
        return await this.apiClient.get<T>(endpoint);
      }
    } catch (error) {
      return await this.apiClient.get<T>(endpoint);
    }
  }
  
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<ApiResponse<T>>(`${config.BASE_URL}${endpoint}`, { 
          method: 'POST',
          body: JSON.stringify(data)
        });
      } else {
        return await this.apiClient.post<T>(endpoint, data);
      }
    } catch (error) {
      return await this.apiClient.post<T>(endpoint, data);
    }
  }
  
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<ApiResponse<T>>(`${config.BASE_URL}${endpoint}`, { 
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        return await this.apiClient.put<T>(endpoint, data);
      }
    } catch (error) {
      return await this.apiClient.put<T>(endpoint, data);
    }
  }
  
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<ApiResponse<T>>(`${config.BASE_URL}${endpoint}`, { 
          method: 'PATCH',
          body: JSON.stringify(data)
        });
      } else {
        return await this.apiClient.patch<T>(endpoint, data);
      }
    } catch (error) {
      return await this.apiClient.patch<T>(endpoint, data);
    }
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const { useCsrf } = await import('../composables/useCsrf');
      const csrf = useCsrf();
      const token = await csrf.getToken();
      
      if (token) {
        const config = this.apiClient.getApiConfig();
        return await csrf.protectedRequest<ApiResponse<T>>(`${config.BASE_URL}${endpoint}`, { method: 'DELETE' });
      } else {
        return await this.apiClient.delete<T>(endpoint);
      }
    } catch (error) {
      return await this.apiClient.delete<T>(endpoint);
    }
  }
}

/**
 * Create a new instance of the protected API client
 */
export const createProtectedApiClient = () => new ProtectedApiClient();
