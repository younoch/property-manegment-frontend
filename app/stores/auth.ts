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
      console.log('Starting signin with credentials:', JSON.stringify(credentials, null, 2));
      const userStore = useUserStore();
      const apiClient = createApiClient();
      
      this.setLoading(true);
      this.clearError();
      
      try {
        console.log('Sending login request to /auth/signin');
        const response = await apiClient.post<{
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
          profile_image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          owned_portfolios: any[];
          notifications: any[];
          requires_onboarding: boolean;
          onboarding_completed_at: string | null;
          last_login_at: string;
          accessToken: string;
          refreshToken: string;
        }>('/auth/signin', credentials);

        console.log('Raw API Response:', JSON.stringify(response.data, null, 2));
        
        // The response is the user data directly
        const userData = response.data;
        
        if (!userData) {
          console.error('No user data in response');
          throw new Error('No user data received from server');
        }
          
          console.log('Processing user data:', {
            hasAccessToken: 'accessToken' in userData,
            hasUserData: 'id' in userData,
            userDataKeys: Object.keys(userData)
          });

          // Log token information (without logging actual tokens in production)
          console.log('Token info:', {
            hasAccessToken: !!userData.accessToken,
            hasRefreshToken: !!userData.refreshToken,
            accessTokenPrefix: userData.accessToken ? userData.accessToken.substring(0, 10) + '...' : 'none',
            refreshTokenPrefix: userData.refreshToken ? userData.refreshToken.substring(0, 10) + '...' : 'none'
          });

          // Store tokens
          if (!userData.accessToken) {
            console.error('No access token in response');
            throw new Error('No access token received from server');
          }
          
          localStorage.setItem('auth_token', userData.accessToken);
          console.log('Access token stored in localStorage');
          
          if (userData.refreshToken) {
            localStorage.setItem('refresh_token', userData.refreshToken);
            console.log('Refresh token stored in localStorage');
          } else {
            console.warn('No refresh token in response');
          }

          // Map user data to our User type
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone || '',
            role: userData.role,
            profile_image_url: userData.profile_image_url || undefined,
            is_active: userData.is_active,
            isEmailVerified: true, // Assuming verified since login succeeded
            requires_onboarding: userData.requires_onboarding,
            onboarding_completed_at: userData.onboarding_completed_at,
            last_login_at: userData.last_login_at,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            owned_portfolios: userData.owned_portfolios || []
          };

          console.log('Mapped user data:', {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            hasProfileImage: !!user.profile_image_url,
            portfolioCount: user.owned_portfolios?.length || 0,
            requiresOnboarding: user.requires_onboarding
          });

          // Update stores
          console.log('Updating user store...');
          this.user = user;
          userStore.setUser(user);

          console.log('Login successful, redirecting...');
          return {
            success: true,
            user,
            requiresOnboarding: user.requires_onboarding
          };
      } catch (error: any) {
        this.user = null;
        userStore.clearUser();
        
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        this.error = errorMessage;
        
        console.error('Login Error:', {
          error,
          errorMessage,
          response: error.response?.data
        });
        
        return {
          success: false,
          error: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        // Only try to call server-side logout if we have a token
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
          try {
            const api = createProtectedApiClient();
            await api.post('/auth/logout');
          } catch (error) {
            console.warn('Server-side logout failed, continuing with client-side cleanup', error);
            // Continue with client-side cleanup even if server logout fails
          }
        }
      } catch (error) {
        console.error('Unexpected error during logout:', error);
      } finally {
        // Clear all auth-related data from client storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        // Clear all cookies by setting them to expire in the past
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
        
        // Clear session storage
        sessionStorage.clear();
        
        // Reset auth state
        this.user = null;
        this.error = null;
        this.loading = false;
        
        // Clear user store
        const userStore = useUserStore();
        userStore.clearUser();
        
        // Force a hard redirect to ensure all state is cleared
        window.location.href = '/auth/login';
      }
    },

    clearCaches() {
      // Clear any cached data when needed
    },

    async signInWithGoogle({ token, role }: GoogleSignInData) {
      console.log('Starting Google sign-in with token and role:', { hasToken: !!token, role });
      this.loading = true;
      this.error = null;
      const userStore = useUserStore();
      
      // Clear any existing tokens to ensure a clean state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      try {
        const api = createApiClient();
        
        interface UserData {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
          profile_image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          owned_portfolios: any[];
          notifications: any[];
          requires_onboarding: boolean;
          onboarding_completed_at: string | null;
          last_login_at: string;
          is_email_verified: boolean;
          google_id?: string;
        }
        
        interface GoogleLoginResponse {
          success: boolean;
          message: string;
          data: UserData;
          timestamp: string;
          path: string;
          accessToken?: string;
          refreshToken?: string;
        }

        console.log('Sending Google login request...');
        const response = await api.post<GoogleLoginResponse>('/auth/google/login', { token, role });

        console.log('Google Login API Response:', response.data);
        
        // Check for successful response
        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Authentication failed');
        }
        
        // Extract user data from response
        const userData = response.data.data;
        console.log('Extracted user data:', userData);
        
        if (!userData) {
          throw new Error('No user data received from Google sign-in');
        }
        
        // Store tokens from response root
        if (!response.data.accessToken) {
          throw new Error('No access token in response');
        }

        console.log('Storing authentication tokens...');
        // Store tokens in localStorage
        localStorage.setItem('auth_token', response.data.accessToken);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        
        // Set up cookie options
        const cookieOptions = {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: typeof window !== 'undefined' ? window.location.hostname : ''
        };
        
        // Set auth token cookie
        const authCookie = `auth_token=${response.data.accessToken}; ` +
                         `Path=${cookieOptions.path}; ` +
                         `SameSite=${cookieOptions.sameSite}; ` +
                         `${cookieOptions.secure ? 'Secure; ' : ''}` +
                         `Max-Age=${cookieOptions.maxAge}`;
        
        // Set refresh token cookie if available
        let refreshCookie = '';
        if (response.data.refreshToken) {
          refreshCookie = `refresh_token=${response.data.refreshToken}; ` +
                         `Path=${cookieOptions.path}; ` +
                         `SameSite=${cookieOptions.sameSite}; ` +
                         `${cookieOptions.secure ? 'Secure; ' : ''}` +
                         `Max-Age=${cookieOptions.maxAge}`;
        }
        
        // Set cookies in the browser
        if (typeof document !== 'undefined') {
          document.cookie = authCookie;
          if (refreshCookie) {
            document.cookie = refreshCookie;
          }
        }
        
        console.log('Authentication tokens stored successfully');

        // Map user data to our User type
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone || '',
          role: userData.role,
          profile_image_url: userData.profile_image_url || undefined,
          is_active: userData.is_active,
          isEmailVerified: userData.is_email_verified || true, // Use server's verification status
          requires_onboarding: userData.requires_onboarding,
          onboarding_completed_at: userData.onboarding_completed_at,
          last_login_at: userData.last_login_at,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          owned_portfolios: userData.owned_portfolios || [],
          googleId: userData.google_id
        };
        
        console.log('Mapped user data:', {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          requiresOnboarding: user.requires_onboarding
        });

        console.log('Mapped Google user data:', {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          hasProfileImage: !!user.profile_image_url,
          requiresOnboarding: user.requires_onboarding
        });

        // Update stores
        this.user = user;
        userStore.setUser(user);

        console.log('Google sign-in successful, redirecting...');
        return {
          success: true,
          user,
          requiresOnboarding: user.requires_onboarding
        };
        
      } catch (error: any) {
        // Clear any partial auth state on error
        this.user = null;
        userStore.clearUser();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to sign in with Google';
        this.error = errorMessage;
        
        console.error('Google Sign-In Error:', {
          error,
          errorMessage,
          response: error.response?.data
        });
        
        return { 
          success: false, 
          error: errorMessage 
        };
      } finally {
        this.loading = false;
      }
    }
  }
});
