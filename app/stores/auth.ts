import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { createApiClient, createProtectedApiClient } from '@/utils/api';
import type { User } from '@/types/auth';

type SignupData = {
  email: string;
  password: string;
  name: string;
  phone: string;
  role?: 'tenant' | 'landlord' | 'manager' | 'super_admin';
};

type LoginCredentials = {
  email: string;
  password: string;
};

type GoogleSignInData = {
  token: string;
  role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
};

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    currentError: (state) => state.error,
    isAuthenticating: (state) => state.loading,
    isAuthenticated: (state) => !!state.user,
    isAuthCacheValid: (state) => {
      if (!state.user) return false;
      // Consider the cache valid for 5 minutes
      const lastActivity = state.user.last_activity ? new Date(state.user.last_activity) : null;
      return lastActivity ? (Date.now() - lastActivity.getTime()) < (5 * 60 * 1000) : false;
    }
  },

  actions: {
    setLoading(value: boolean) {
      this.loading = value;
    },

    setError(message: string | null) {
      this.error = message;
    },

    clearError() {
      this.error = null;
    },

    async checkAuth() {
      try {
        this.setLoading(true);
        this.clearError();
        
        const userStore = useUserStore();
        const api = createProtectedApiClient();
        const response = await api.get<{
          id: string;
          email: string;
          name: string;
          phone: string;
          role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
          profile_image_url?: string;
          is_active?: boolean;
          requires_onboarding?: boolean;
          onboarding_completed_at?: string | null;
          owned_portfolios?: Array<{
            id: string;
            name: string;
            // Add other portfolio properties as needed
          }>;
        }>('/auth/whoami');
        
        if (response.data) {
          const userData = response.data;
          const user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            profile_image_url: userData.profile_image_url,
            is_active: userData.is_active,
            requires_onboarding: userData.requires_onboarding,
            onboarding_completed_at: userData.onboarding_completed_at,
            owned_portfolios: userData.owned_portfolios || []
          };
          
          // Update both auth and user stores
          this.user = user;
          userStore.setUser(user);
          
          return { success: true, user };
        }
        
        return { success: false, error: 'No user data received' };
      } catch (error: any) {
        console.error('Error in checkAuth:', error);
        this.setError(error.response?.data?.message || 'Failed to check authentication');
        return { 
          success: false, 
          error: error.response?.data?.message || 'Failed to check authentication' 
        };
      } finally {
        this.setLoading(false);
      }
    },


    async completeOnboarding(): Promise<boolean> {
      try {
        const api = createProtectedApiClient();
        await api.post('/auth/complete-onboarding');
        
        if (this.user) {
          this.user.requires_onboarding = false;
        }
        return true;
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        return false;
      }
    },

    async signup(userData: SignupData) {
      const userStore = useUserStore();
      const apiClient = createApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await apiClient.post<any>('/auth/signup', userData);
        
        if (response) {
          const userDataFromResponse = response.data || response.user || response;
          
          if (userDataFromResponse) {
            userDataFromResponse.requires_onboarding = true;
            
            // Update auth store
            this.user = userDataFromResponse;
            
            // Update user store with all required fields
            userStore.setUser({
              id: userDataFromResponse.id,
              email: userDataFromResponse.email,
              name: userDataFromResponse.name,
              phone: userDataFromResponse.phone || userData.phone,
              role: (userDataFromResponse.role || userData.role || 'tenant') as 'tenant' | 'landlord' | 'manager' | 'super_admin',
              requires_onboarding: true,
              is_active: true,
              profile_image_url: userDataFromResponse.profile_image_url
            });
            
            // Set auth token if available in response
            if (response.token) {
              localStorage.setItem('auth_token', response.token);
            }
            
            return { 
              success: true, 
              user: userDataFromResponse,
            };
          }
        }
        
        throw new Error('No response data received');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        this.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);
      }
    },

    async signin(credentials: LoginCredentials) {
      const userStore = useUserStore();
      const apiClient = createApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        const response = await apiClient.post<{
          success: boolean;
          data: {
            user: {
              id: string;
              email: string;
              name: string;
              role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
              profile_image_url?: string;
              is_email_verified: boolean;
              requires_onboarding: boolean;
              phone?: string;
            };
            tokens: {
              access_token: string;
              refresh_token: string;
            };
          };
        }>('/auth/signin', credentials);
        
        if (response.data?.success && response.data.data) {
          const { user, tokens } = response.data.data;
          
          // Store tokens
          if (tokens?.access_token) {
            localStorage.setItem('auth_token', tokens.access_token);
          }
          if (tokens?.refresh_token) {
            localStorage.setItem('refresh_token', tokens.refresh_token);
          }
          
          // Map user data to our User type
          const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone || '',
            role: user.role,
            profile_image_url: user.profile_image_url,
            is_active: true, // Assuming active since login succeeded
            isEmailVerified: user.is_email_verified,
            requires_onboarding: user.requires_onboarding
          };
          
          // Update stores
          this.user = userData;
          userStore.setUser(userData);
          
          return { 
            success: true, 
            user: userData,
            requiresOnboarding: user.requires_onboarding
          };
        }
        
        throw new Error('Invalid response from server');
      } catch (error: any) {
        this.user = null;
        userStore.clearUser();
        
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        this.setError(errorMessage);
        
        return { 
          success: false, 
          error: errorMessage 
        };
      } finally {
        this.setLoading(false);
      }
    },

    async logout() {
      try {
        // Call server-side logout
        const api = createProtectedApiClient();
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear all auth-related data from client storage
        localStorage.removeItem('auth_token');
        
        // Clear all cookies (handles httpOnly cookies on the next request)
        document.cookie.split(';').forEach(c => {
          document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
        });
        
        // Clear stores
        this.user = null;
        const userStore = useUserStore();
        userStore.clearUser();
        
        // Redirect to login page
        if (process.client) {
          window.location.href = '/auth/login';
        }
      }
    },

    clearCaches() {
      // Clear any cached data when needed
    },

    async signInWithGoogle({ token, role }: GoogleSignInData) {
      this.setLoading(true);
      this.clearError();
      const userStore = useUserStore();

      try {
        const api = createApiClient();
        
        const response = await api.post<{
          success: boolean;
          data: {
            user: {
              id: string;
              email: string;
              name: string;
              role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
              profile_image_url?: string;
              is_email_verified: boolean;
              requires_onboarding: boolean;
              phone?: string;
              google_id?: string;
            };
            tokens: {
              access_token: string;
              refresh_token: string;
            };
          };
        }>('/auth/google/login', { token, role });

        if (response.data?.success && response.data?.data) {
          const { user, tokens } = response.data.data;
          
          // Store tokens
          if (tokens?.access_token) {
            localStorage.setItem('auth_token', tokens.access_token);
          }
          if (tokens?.refresh_token) {
            localStorage.setItem('refresh_token', tokens.refresh_token);
          }
          
          // Map user data to our User type
          const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone || '',
            role: user.role,
            profile_image_url: user.profile_image_url,
            is_active: true, // Assuming active since login succeeded
            isEmailVerified: user.is_email_verified,
            requires_onboarding: user.requires_onboarding,
            googleId: user.google_id
          };
          
          // Update stores
          this.user = userData;
          userStore.setUser(userData);
          
          return { 
            success: true, 
            user: userData,
            requiresOnboarding: user.requires_onboarding
          };
        }
        
        throw new Error('Authentication failed - Missing user data or access token');
        
      } catch (error: any) {
        // Clear any partial auth state on error
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to sign in with Google';
        this.setError(errorMessage);
        console.error('Google Sign-In Error:', error);
        return { success: false, error: errorMessage };
      } finally {
        this.setLoading(false);
      }
    }
  }
});
