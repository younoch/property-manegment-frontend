import { defineStore } from 'pinia';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
}

export interface UserState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  lastActivity: Date | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: true,
    isAuthenticated: false,
    lastActivity: null
  }),

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
      this.lastActivity = user ? new Date() : null;
      this.loading = false;
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
      if (process.client) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            this.setUser(user);
          }
        } catch (error) {
          console.error('Failed to restore user from storage:', error);
          this.clearUser();
        }
      }
    },

    // Persist user to localStorage
    persistToStorage() {
      if (process.client && this.user) {
        try {
          localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
          console.error('Failed to persist user to storage:', error);
        }
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
