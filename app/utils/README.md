# Centralized API Utility

This utility provides a centralized way to make API requests throughout the application, ensuring consistency and maintainability.

## Features

- **Public API Methods**: For endpoints that don't require CSRF protection
- **Protected API Methods**: For endpoints that require CSRF tokens
- **Automatic Configuration**: Uses the centralized API configuration
- **Type Safety**: Full TypeScript support with generics
- **Error Handling**: Consistent error handling across all requests

## Usage

### Basic Usage

```typescript
import { createApiClient } from '../utils/api';

const apiClient = createApiClient();

// Public endpoints
const user = await apiClient.get<User>('/users/123');
const newUser = await apiClient.post<User>('/users', userData);

// Protected endpoints (with CSRF token)
const protectedData = await apiClient.protectedGet<Data>('/protected/data');
const updatedData = await apiClient.protectedPost<Data>('/protected/update', data);
```

### Helper Functions

```typescript
import { makeRequest, makeProtectedRequest } from '../utils/api';

// Single public request
const data = await makeRequest<DataType>('/endpoint', { method: 'POST', body: data });

// Single protected request
const protectedData = await makeProtectedRequest<DataType>('/protected/endpoint', { method: 'POST' });
```

## API Methods

### Public Methods (No CSRF Required)

- `get<T>(endpoint, options?)` - GET request
- `post<T>(endpoint, data?, options?)` - POST request
- `put<T>(endpoint, data?, options?)` - PUT request
- `patch<T>(endpoint, data?, options?)` - PATCH request
- `delete<T>(endpoint, options?)` - DELETE request

### Protected Methods (CSRF Required)

- `protectedGet<T>(endpoint)` - Protected GET request
- `protectedPost<T>(endpoint, data?)` - Protected POST request
- `protectedPut<T>(endpoint, data?)` - Protected PUT request
- `protectedPatch<T>(endpoint, data?)` - Protected PATCH request
- `protectedDelete<T>(endpoint)` - Protected DELETE request

## Benefits

1. **Centralized Configuration**: All API calls use the same base URL and settings
2. **Consistent Error Handling**: Uniform error handling across the application
3. **Type Safety**: Full TypeScript support with generics
4. **Maintainability**: Easy to update API behavior in one place
5. **CSRF Protection**: Automatic CSRF token handling for protected endpoints
6. **Reusability**: Can be used in stores, composables, and components

## Migration from Direct $fetch

### Before (Direct $fetch)
```typescript
const response = await $fetch(`${API_CONFIG.BASE_URL}/auth/signin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: credentials
});
```

### After (Centralized API)
```typescript
const apiClient = createApiClient();
const response = await apiClient.post('/auth/signin', credentials);
```

## Example in Store

```typescript
import { createApiClient } from '../utils/api';

export const useAuthStore = defineStore('auth', {
  actions: {
    async signin(credentials) {
      const apiClient = createApiClient();
      
      try {
        const response = await apiClient.post('/auth/signin', credentials);
        // Handle response...
      } catch (error) {
        // Handle error...
      }
    }
  }
});
```

## Example in Composable

```typescript
import { createApiClient } from '../utils/api';

export const useUsers = () => {
  const apiClient = createApiClient();
  
  const fetchUsers = async () => {
    return await apiClient.get<User[]>('/users');
  };
  
  const createUser = async (userData) => {
    return await apiClient.post<User>('/users', userData);
  };
  
  return { fetchUsers, createUser };
};
```
