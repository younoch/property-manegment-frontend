// Demo file showing how to use constants in components
// This file is for demonstration purposes only

import { 
  USER_ROLES, 
  PROPERTY_TYPES, 
  MAINTENANCE_PRIORITIES,
  getRoleByValue,
  getPropertyTypeByValue,
  getMaintenancePriorityByValue
} from './index';

// Example: Using constants in a Vue component
export const useConstantsDemo = () => {
  
  // Get role information
  const getRoleInfo = (roleValue: string) => {
    const role = getRoleByValue(roleValue);
    if (role) {
      return {
        label: role.label,
        color: role.color,
        permissions: role.permissions
      };
    }
    return null;
  };

  // Get property type options for a select dropdown
  const getPropertyTypeOptions = () => {
    return PROPERTY_TYPES.map(type => ({
      label: type.label,
      value: type.value,
      icon: type.icon
    }));
  };

  // Get maintenance priority with response time
  const getPriorityInfo = (priorityValue: string) => {
    const priority = getMaintenancePriorityByValue(priorityValue);
    if (priority) {
      return {
        label: priority.label,
        color: priority.color,
        responseTime: priority.responseTime
      };
    }
    return null;
  };

  // Filter roles by permission
  const getRolesByPermission = (permission: string) => {
    return USER_ROLES.filter(role => 
      role.permissions.includes(permission) || 
      role.permissions.includes('all_permissions')
    );
  };

  return {
    getRoleInfo,
    getPropertyTypeOptions,
    getPriorityInfo,
    getRolesByPermission
  };
};

// Example: Constants for form validation
export const FORM_VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20
};

// Example: API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  MAINTENANCE: {
    LIST: '/api/maintenance',
    CREATE: '/api/maintenance',
    UPDATE: '/api/maintenance/:id',
    DELETE: '/api/maintenance/:id'
  }
};

// Example: Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Example: Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is temporarily locked',
    SESSION_EXPIRED: 'Your session has expired. Please login again.'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    PASSWORDS_DONT_MATCH: 'Passwords do not match'
  },
  NETWORK: {
    CONNECTION_ERROR: 'Unable to connect to server',
    TIMEOUT: 'Request timed out',
    SERVER_ERROR: 'Server error occurred'
  }
};
