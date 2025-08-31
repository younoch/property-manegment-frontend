import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { createApiClient, createProtectedApiClient } from '../utils/api';
import { getCookie, hasCookie, logCookies } from '../utils/cookies';
import { getCacheDuration } from '../constants/cache';
import { ENDPOINTS } from '../config/api';
import type { AuthState } from '../types/auth';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    error: null,
    lastActivity: null,
    lastAuthCheck: null,
    lastCsrfCheck: null,
    authCacheDuration: getCacheDuration('auth'),
    csrfCacheDuration: getCacheDuration('csrf'),
  }),

  getters: {
    // Get current error
    currentError: (state) => state.error,
    
    // Check if authentication is in progress
    isAuthenticating: (state) => state.loading,
    
    // Get last authentication check time
    lastCheck: (state) => state.lastAuthCheck,
    
    // Check if auth cache is still valid
    isAuthCacheValid: (state) => {
      if (!state.lastAuthCheck || !state.authCacheDuration) return false;
      return (Date.now() - state.lastAuthCheck.getTime()) < (state.authCacheDuration * 1000);
    },
    
    // Check if CSRF cache is still valid
    isCsrfCacheValid: (state) => {
      if (!state.lastCsrfCheck || !state.csrfCacheDuration) return false;
      return (Date.now() - state.lastCsrfCheck.getTime()) < (state.csrfCacheDuration * 1000);
    }
  },

  actions: {
    // Set loading state
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    // Set error message
    setError(error: string | null) {
      this.error = error;
    },

    // Clear error
    clearError() {
      this.error = null;
    },

    // Update last auth check time
    updateLastAuthCheck() {
      this.lastAuthCheck = new Date();
    },

    // Update last CSRF check time
    updateLastCsrfCheck() {
      this.lastCsrfCheck = new Date();
    },

    // Set cache durations (configurable)
    setCacheDurations(authDuration: number, csrfDuration: number) {
      this.authCacheDuration = authDuration;
      this.csrfCacheDuration = csrfDuration;
    },

    // User registration
    async signup(userData: {
      email: string;
      password: string;
      name: string;
      phone: string;
      role?: 'tenant' | 'landlord' | 'manager' | 'super_admin';
    }) {
      const userStore = useUserStore();
      const apiClient = createApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await apiClient.post<any>('/auth/register', userData);
        
        if (response) {
          // Handle different response structures
          let userDataFromResponse: any;
          if (response.data) {
            // Response has data wrapper: { data: { user info } }
            userDataFromResponse = response.data;
          } else if (response.user) {
            // Response has user wrapper: { user: { user info } }
            userDataFromResponse = response.user;
          } else {
            // Response is direct user data
            userDataFromResponse = response;
          }
          
          // Ensure userDataFromResponse has required fields
          if (userDataFromResponse && (userDataFromResponse.id || userDataFromResponse.email)) {
            // Set user in store
            userStore.setUser(userDataFromResponse);
            userStore.persistToStorage();
            
            this.updateLastAuthCheck();

            return { success: true, user: userDataFromResponse };
          } else {
            throw new Error('Invalid user data received from server');
          }
        }
      } catch (error: any) {
        const errorMessage = error.data?.message || error.message || 'Registration failed';
        this.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    // User login
    async signin(credentials: { email: string; password: string }) {
      const userStore = useUserStore();
      const apiClient = createApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await apiClient.post<any>(ENDPOINTS.AUTH.SIGNIN, credentials);
        
        if (response) {
          // Handle different response structures
          let userData: any;
          if (response.data) {
            // Response has data wrapper: { data: { user info } }
            userData = response.data;
          } else if (response.user) {
            // Response has user wrapper: { user: { user info } }
            userData = response.user;
          } else {
            // Response is direct user data
            userData = response;
          }
          
          // Ensure userData has required fields
          if (userData && (userData.id || userData.email)) {
            // Set user in store
            userStore.setUser(userData);
            userStore.persistToStorage();
            
            // Initialize CSRF token after successful login
            const { tokenManager } = await import('../services/tokenManager');
            await tokenManager.getCsrfToken();
            
            this.updateLastAuthCheck();

            return { success: true, user: userData };
          } else {
            throw new Error('Invalid user data received from server');
          }
        }
      } catch (error: any) {
        const errorMessage = error.data?.message || error.message || 'Login failed';
        this.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    // User logout
    async signout() {
      const userStore = useUserStore();
      

      this.setLoading(true);
      this.clearError();
      
      try {
        // Revoke JWT token using the new endpoint

        const { tokenManager } = await import('../services/tokenManager');
        const revokeResult = await tokenManager.revokeJwtToken();
        

        
        // Clear user from store

        userStore.clearUser();
        userStore.clearStorage();
        
        // Clear cache timestamps
        this.lastAuthCheck = null;
        this.lastCsrfCheck = null;
        

        return { success: true };
      } catch (error: any) {
        console.error('[AuthStore] Signout error:', error);
        const errorMessage = error.data?.message || error.message || 'Logout failed';
        this.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);

      }
    },

    // Check authentication status using new /auth/validate endpoint
    async checkAuth(force: boolean = false) {
      const userStore = useUserStore();
      
      // If cache is valid and not forcing, return cached result
      if (!force && this.isAuthCacheValid) {
        const hasUser = !!userStore.currentUser;

        return { success: hasUser, user: userStore.currentUser, cached: true };
      }
      
      this.setLoading(true);
      this.clearError();
      
      try {
        // Use the new token manager to validate JWT
        const { tokenManager } = await import('../services/tokenManager');
        const validation = await tokenManager.validateJwtToken();
        
        if (validation.valid && validation.user) {
          // Set user in store
          userStore.setUser(validation.user);
          userStore.persistToStorage();
          
          this.updateLastAuthCheck();

          return { success: true, user: validation.user, cached: false };
        } else {
          // Invalid or expired JWT
          userStore.clearUser();
          userStore.clearStorage();
          this.updateLastAuthCheck();
          return { success: false, error: validation.message || 'Token validation failed', cached: false };
        }
      } catch (error: any) {
        userStore.clearUser();
        userStore.clearStorage();
        
        const errorMessage = error?.data?.message || error?.message || 'Authentication check failed';
        this.setError(errorMessage);
        this.updateLastAuthCheck();
        return { success: false, error: errorMessage, cached: false };
      } finally {
        this.setLoading(false);
      }
    },

    // Quick authentication check using only cookies (no API call)
    checkAuthFromCookies() {

      logCookies();
      
      const possibleAuthCookies = ['access_token', 'refresh_token', 'token', 'auth_token', 'session'];
      
      for (const cookieName of possibleAuthCookies) {
        if (hasCookie(cookieName)) {
          const cookieValue = getCookie(cookieName);

          return { success: true, cookieName, cookieValue };
        }
      }
      

      return { success: false, error: 'No authentication cookies found' };
    },

    // Refresh tokens using new token manager
    async refreshTokens() {
      this.setLoading(true);
      this.clearError();
      
      try {
        const { tokenManager } = await import('../services/tokenManager');
        
        // Refresh both JWT and CSRF tokens
        const [jwtSuccess, csrfSuccess] = await Promise.all([
          tokenManager.refreshJwtToken(),
          tokenManager.refreshCsrfToken()
        ]);
        
        if (jwtSuccess || csrfSuccess) {
          this.updateLastAuthCheck();
          return { success: true, message: 'Tokens refreshed successfully' };
        } else {
          throw new Error('Failed to refresh tokens');
        }
      } catch (error: any) {
        const errorMessage = error.data?.message || error.message || 'Token refresh failed';
        this.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    // Initialize authentication - restore from storage then validate with server ONCE
    async initialize() {
      const userStore = useUserStore();
      
      // Try to restore user from storage first (optimistic UI)
      userStore.initializeFromStorage();
      
      // Only validate with server if cache is invalid or doesn't exist
      if (!this.isAuthCacheValid) {

        await this.checkAuth();
      } else {

      }
    },

    // Force refresh authentication (bypasses cache)
    async forceRefreshAuth() {

      return await this.checkAuth(true);
    },

    // Clear all caches (useful for testing or when you need fresh data)
    clearCaches() {
      this.lastAuthCheck = null;
      this.lastCsrfCheck = null;

    }
  }
});
