import { computed } from 'vue';
import { useCsrf } from './useCsrf';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  
  // Get CSRF utilities
  const { getToken, clearToken } = useCsrf();

  // Computed properties that sync with stores
  const user = computed(() => userStore.currentUser);
  const loading = computed(() => authStore.isAuthenticating);
  const isAuthenticated = computed(() => userStore.isLoggedIn);
  const error = computed(() => authStore.currentError);
  const isAuthCacheValid = computed(() => authStore.isAuthCacheValid);

  // User registration - now uses auth store
  const signup = async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: 'tenant' | 'landlord' | 'manager' | 'super_admin';
  }) => {
    const result = await authStore.signup(userData);
    
    // If successful, try to get CSRF token
    if (result?.success) {
      try {
        await getToken();
      } catch (csrfError) {
        console.warn('CSRF token fetch failed after signup, but signup succeeded:', csrfError);
      }
    }
    
    return result;
  };

  // User login - now uses auth store
  const signin = async (credentials: { email: string; password: string }) => {
    const result = await authStore.signin(credentials);
    
    // If successful, try to get CSRF token
    if (result?.success) {
      try {
        await getToken();
      } catch (csrfError) {
        console.warn('CSRF token fetch failed after login, but login succeeded:', csrfError);
      }
    }
    
    return result;
  };

  // User logout - now uses auth store
  const signout = async () => {
    const result = await authStore.signout();
    
    // Clear CSRF token on logout
    if (result?.success) {
      clearToken();
    }
    
    return result;
  };

  // Check authentication status - route-agnostic
  const checkAuth = async () => {
    const result = await authStore.checkAuth();
    
    // If successful, try to get CSRF token
    if (result?.success) {
      try {
        await getToken();
      } catch (csrfError) {
        console.warn('CSRF token fetch failed, but authentication succeeded:', csrfError);
      }
    }
    
    return result;
  };

  // Quick authentication check using only cookies (no API call)
  const checkAuthFromCookies = () => {
    return authStore.checkAuthFromCookies();
  };

  // Refresh access token - now uses auth store
  const refreshTokens = async () => {
    return await authStore.refreshTokens();
  };

  // Role-based access control - now uses user store
  const hasRole = (role: User['role']) => userStore.hasRole(role);
  const hasAnyRole = (roles: User['role'][]) => userStore.hasAnyRole(roles);

  // Get user role - now uses user store
  const getUserRole = () => userStore.userRole;

  // Initialize authentication
  const initialize = async () => {
    return await authStore.initialize();
  };

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated: readonly(isAuthenticated),
    error: readonly(error),
    isAuthCacheValid: readonly(isAuthCacheValid),
    
    // Methods
    signup,
    signin,
    signout,
    checkAuth,
    checkAuthFromCookies,
    refreshTokens,
    hasRole,
    hasAnyRole,
    getUserRole,
    initialize
  };
};
