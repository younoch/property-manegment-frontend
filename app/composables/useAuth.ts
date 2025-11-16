import { computed, readonly } from 'vue';
import type { User } from '@/types/auth';

// Lazy load stores and utilities
const loadStores = () => Promise.all([
  import('@/stores/auth').then(m => m.useAuthStore()),
  import('@/stores/user').then(m => m.useUserStore()),
  import('./useCsrf').then(m => m.useCsrf())
]);

// Cache for memoization
let cachedStores: any = null;

const getStores = async () => {
  if (!cachedStores) {
    cachedStores = await loadStores();
  }
  return cachedStores;
};

export const useAuth = () => {
  // Initialize state with null values that will be populated on first use
  let authStore: any = null;
  let userStore: any = null;
  let csrf: any = null;
  
  // Lazy getter for stores
  const getStoresLazy = async () => {
    if (!authStore || !userStore || !csrf) {
      [authStore, userStore, csrf] = await getStores();
    }
    return { authStore, userStore, csrf };
  };

  // Computed properties that sync with stores
  const user = computed(() => userStore?.currentUser);
  const loading = computed(() => authStore?.isAuthenticating);
  const isAuthenticated = computed(() => userStore?.isLoggedIn);
  const error = computed(() => authStore?.currentError);
  const isAuthCacheValid = computed(() => authStore?.isAuthCacheValid);

  // Helper function to handle CSRF token operations
  const withCsrf = async <T>(fn: (csrf: any) => Promise<T>): Promise<T> => {
    const { csrf } = await getStoresLazy();
    return fn(csrf);
  };

  // User registration
  const signup = async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: 'tenant' | 'landlord' | 'manager' | 'super_admin';
  }) => {
    const { authStore } = await getStoresLazy();
    const result = await authStore.signup(userData);
    
    if (result?.success) {
      await withCsrf(async (csrf) => {
        try {
          await csrf.getToken();
        } catch (e) {
          console.warn('CSRF token fetch failed after signup:', e);
        }
      });
    }
    
    return result;
  };

  // User login
  const signin = async (credentials: { email: string; password: string }) => {
    const { authStore } = await getStoresLazy();
    const result = await authStore.signin(credentials);
    
    if (result?.success) {
      await withCsrf(async (csrf) => {
        try {
          await csrf.getToken();
        } catch (e) {
          console.warn('CSRF token fetch failed after login:', e);
        }
      });
    }
    
    return result;
  };

  // User logout
  const signout = async () => {
    const { authStore } = await getStoresLazy();
    const result = await authStore.signout();
    
    if (result?.success) {
      await withCsrf(({ clearToken }) => clearToken());
    }
    
    return result;
  };

  // Check authentication status
  const checkAuth = async () => {
    const { authStore } = await getStoresLazy();
    const result = await authStore.checkAuth();
    
    if (result?.success) {
      await withCsrf(async (csrf) => {
        try {
          await csrf.getToken();
        } catch (e) {
          console.warn('CSRF token fetch failed after auth check:', e);
        }
      });
    }
    
    return result;
  };

  // Quick auth check using cookies
  const checkAuthFromCookies = async () => {
    const { authStore } = await getStoresLazy();
    return authStore.checkAuthFromCookies();
  };

  // Refresh tokens
  const refreshTokens = async () => {
    const { authStore } = await getStoresLazy();
    return authStore.refreshTokens();
  };

  // Role-based access control
  const hasRole = async (role: User['role']) => {
    const { userStore } = await getStoresLazy();
    return userStore.hasRole(role);
  };

  const hasAnyRole = async (roles: User['role'][]) => {
    const { userStore } = await getStoresLazy();
    return userStore.hasAnyRole(roles);
  };

  // Get user role
  const getUserRole = async () => {
    const { userStore } = await getStoresLazy();
    return userStore.userRole;
  };

  // Initialize authentication
  const initialize = async () => {
    const { authStore } = await getStoresLazy();
    return authStore.initialize();
  };

  return {
    // State (readonly)
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
