import { defineStore } from 'pinia';
import type { User } from '../types/auth';
import { createApiClient } from '../utils/api';

export interface UserState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  lastActivity: Date | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    // Try to initialize from localStorage if available
    let initialState = {
      user: null,
      loading: false,
      isAuthenticated: false,
      lastActivity: null
    };

    if (process.client) {
      try {
        const stored = localStorage.getItem('user-store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            // Only use stored state if it's not too old (e.g., less than 1 day)
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            
            if (parsed.lastActivity && new Date(parsed.lastActivity) > oneDayAgo) {
              return {
                user: parsed.user,
                loading: false,
                isAuthenticated: !!parsed.user,
                lastActivity: new Date(parsed.lastActivity)
              };
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored user state', e);
      }
    }
    
    return initialState;
  },

  getters: {
    // Get current user
    currentUser: (state) => state.user,
    
    // Check if user is authenticated
    isLoggedIn: (state) => state.isAuthenticated,
    
    // Get user role
    userRole: (state) => state.user?.role || null,
    
    // Check if user has specific role
    hasRole: (state) => (role: User['role']) => state.user?.role === role,
    
    // Check if user has any of the specified roles
    hasAnyRole: (state) => (roles: User['role'][]) => 
      roles.includes(state.user?.role || '' as User['role']),
    
    // Get user display name
    displayName: (state) => state.user?.name || 'User',
    
    // Check if user is admin
    isAdmin: (state) => state.user?.role === 'super_admin',
    
    // Check if user is landlord
    isLandlord: (state) => state.user?.role === 'landlord',
    
    // Check if user is tenant
    isTenant: (state) => state.user?.role === 'tenant',
    
    // Check if user is manager
    isManager: (state) => state.user?.role === 'manager'
  },

  actions: {
    // Set user data
    setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
      this.loading = false;
      this.lastActivity = new Date();
      this.persistToStorage();
    },
    
    // Fetch user data from API
    async fetchUser() {
      try {
        this.loading = true;
        const api = createApiClient();
        const response = await api.get('/auth/whoami');
        if (response.data) {
          this.setUser(response.data as User);
        } else {
          this.clearUser();
        }
      } catch (error) {
        this.clearUser();
      } finally {
        this.loading = false;
      }
    },

    // Set loading state
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    // Update user data
    updateUser(updates: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
        this.lastActivity = new Date();
      }
    },

    // Clear user data (logout)
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.lastActivity = null;
      this.loading = false;
    },

    // Update last activity
    updateLastActivity() {
      this.lastActivity = new Date();
    },

    // Check if user session is still valid (optional)
    isSessionValid() {
      if (!this.lastActivity) return false;
      
      // Check if last activity was within 24 hours
      const hoursSinceLastActivity = (Date.now() - this.lastActivity.getTime()) / (1000 * 60 * 60);
      return hoursSinceLastActivity < 24;
    },

    // Initialize store from localStorage (if available)
    initializeFromStorage() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        } else {
          // No stored user data found
        }
      } catch (error) {
        this.clearStorage();
      }
    },

    // Persist user to localStorage
    persistToStorage() {
      if (process.client && this.user) {
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    // Clear stored user data
    clearStorage() {
      if (process.client) {
        try {
          localStorage.removeItem('user');
        } catch (error) {
          console.error('Failed to clear user from storage:', error);
        }
      }
    }
  }
});
