import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { createApiClient, createProtectedApiClient } from '../utils/api';
import { getCookie, hasCookie, logCookies } from '../utils/cookies';
import { getCacheDuration } from '../constants/cache';

export interface AuthState {
  loading: boolean;
  error: string | null;
  lastAuthCheck: Date | null;
  lastCsrfCheck: Date | null;
  authCacheDuration: number; // Cache duration in milliseconds
  csrfCacheDuration: number; // CSRF cache duration in milliseconds
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    loading: false,
    error: null,
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
      if (!state.lastAuthCheck) return false;
      const now = new Date();
      const timeSinceLastCheck = now.getTime() - state.lastAuthCheck.getTime();
      return timeSinceLastCheck < state.authCacheDuration;
    },
    
    // Check if CSRF cache is still valid
    isCsrfCacheValid: (state) => {
      if (!state.lastCsrfCheck) return false;
      const now = new Date();
      const timeSinceLastCheck = now.getTime() - state.lastCsrfCheck.getTime();
      return timeSinceLastCheck < state.csrfCacheDuration;
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
        const response = await apiClient.post<any>('/auth/signup', userData);
        
        if (response) {
          // Set user in store
          userStore.setUser(response as any);
          userStore.persistToStorage();
          
          this.updateLastAuthCheck();
          return { success: true, user: response };
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
        const response = await apiClient.post<any>('/auth/signin', credentials);
        
        if (response) {
          // Set user in store
          userStore.setUser(response as any);
          userStore.persistToStorage();
          
          this.updateLastAuthCheck();
          return { success: true, user: response };
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
      const protectedApiClient = createProtectedApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        await protectedApiClient.post('/auth/signout');
        
        // Clear user from store
        userStore.clearUser();
        userStore.clearStorage();
        
        // Clear cache timestamps
        this.lastAuthCheck = null;
        this.lastCsrfCheck = null;
        
        return { success: true };
      } catch (error: any) {
        const errorMessage = error.data?.message || error.message || 'Logout failed';
        this.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    // Check authentication status (server-validated) with smart caching
    async checkAuth(force: boolean = false) {
      const userStore = useUserStore();
      
      // If cache is valid and not forcing, return cached result
      if (!force && this.isAuthCacheValid) {
        const hasUser = !!userStore.currentUser;
        console.log(`✅ Auth cache valid, skipping API call (hasUser=${hasUser})`);
        return { success: hasUser, user: userStore.currentUser, cached: true };
      }
      
      const apiClient = createApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await apiClient.get<any>('/auth/whoami');
        
        if (response && (response as any).data) {
          // Set user in store
          userStore.setUser((response as any).data);
          userStore.persistToStorage();
          
          this.updateLastAuthCheck();
          return { success: true, user: (response as any).data, cached: false };
        }
        
        // No response means unauthenticated
        userStore.clearUser();
        userStore.clearStorage();
        this.updateLastAuthCheck();
        return { success: false, error: 'Not authenticated', cached: false };
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
      console.log('=== Quick auth check from cookies only ===');
      logCookies();
      
      const possibleAuthCookies = ['access_token', 'refresh_token', 'token', 'auth_token', 'session'];
      
      for (const cookieName of possibleAuthCookies) {
        if (hasCookie(cookieName)) {
          const cookieValue = getCookie(cookieName);
          console.log(`✅ Quick auth: Found ${cookieName} = ${cookieValue?.substring(0, 20)}...`);
          return { success: true, cookieName, cookieValue };
        }
      }
      
      console.log('❌ Quick auth: No auth cookies found');
      return { success: false, error: 'No authentication cookies found' };
    },

    // Refresh tokens
    async refreshTokens() {
      const protectedApiClient = createProtectedApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await protectedApiClient.post('/auth/refresh');
        
        if (response) {
          this.updateLastAuthCheck();
          return { success: true, message: 'Tokens refreshed successfully' };
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
        console.log('🔄 Initial auth check - cache invalid or missing');
        await this.checkAuth();
      } else {
        console.log('✅ Initial auth check - using cached result');
      }
    },

    // Force refresh authentication (bypasses cache)
    async forceRefreshAuth() {
      console.log('🔄 Force refreshing authentication');
      return await this.checkAuth(true);
    },

    // Clear all caches (useful for testing or when you need fresh data)
    clearCaches() {
      this.lastAuthCheck = null;
      this.lastCsrfCheck = null;
      console.log('🧹 All auth caches cleared');
    }
  }
});
