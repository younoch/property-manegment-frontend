<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Token Refresh Demo</h1>
        
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">How it works:</h2>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p class="text-blue-800">
              This demo shows the automatic token refresh functionality. When an API call fails due to an expired token:
            </p>
            <ol class="list-decimal list-inside mt-2 text-blue-800 space-y-1">
              <li>The system detects the token expiration (401/403 errors)</li>
              <li>Automatically calls <code class="bg-blue-100 px-1 rounded">/csrf/refresh</code></li>
              <li>Retries the original API call with the refreshed token</li>
              <li>Returns the result to the user seamlessly</li>
            </ol>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- CSRF Token Status -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">CSRF Token Status</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Token:</span>
                <span class="font-mono text-sm">
                  {{ csrfToken ? `${csrfToken.substring(0, 20)}...` : 'None' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Cache Valid:</span>
                <span :class="csrfCacheValid ? 'text-green-600' : 'text-red-600'">
                  {{ csrfCacheValid ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Last Fetch:</span>
                <span class="text-sm text-gray-500">
                  {{ lastFetch ? new Date(lastFetch).toLocaleTimeString() : 'Never' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Authentication Status -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Authentication Status</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Authenticated:</span>
                <span :class="isAuthenticated ? 'text-green-600' : 'text-red-600'">
                  {{ isAuthenticated ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">User:</span>
                <span class="text-sm text-gray-500">
                  {{ user?.name || 'Not logged in' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Role:</span>
                <span class="text-sm text-gray-500">
                  {{ user?.role || 'None' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Test API Calls</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              @click="testPublicApi"
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ loading ? 'Loading...' : 'Test Public API' }}
            </button>
            
            <button
              @click="testProtectedApi"
              :disabled="loading || !isAuthenticated"
              class="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ loading ? 'Loading...' : 'Test Protected API' }}
            </button>
            
            <button
              @click="forceRefreshToken"
              :disabled="loading"
              class="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ loading ? 'Loading...' : 'Force Refresh Token' }}
            </button>
            
            <button
              @click="clearToken"
              :disabled="loading"
              class="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ loading ? 'Loading...' : 'Clear Token' }}
            </button>
          </div>
        </div>

        <!-- Results -->
        <div v-if="results.length > 0" class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">API Call Results</h3>
          <div class="space-y-3">
            <div
              v-for="(result, index) in results"
              :key="index"
              :class="[
                'p-4 rounded-lg border-l-4',
                result.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
              ]"
            >
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium" :class="result.success ? 'text-green-800' : 'text-red-800'">
                    {{ result.action }}
                  </p>
                  <p class="text-sm mt-1" :class="result.success ? 'text-green-600' : 'text-red-600'">
                    {{ result.message }}
                  </p>
                  <p v-if="result.details" class="text-xs mt-2 text-gray-600 font-mono">
                    {{ result.details }}
                  </p>
                </div>
                <span class="text-xs text-gray-500">
                  {{ new Date(result.timestamp).toLocaleTimeString() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 class="text-lg font-medium text-yellow-800 mb-2">Testing Instructions</h3>
          <p class="text-yellow-700 text-sm">
            To test the automatic token refresh:
          </p>
          <ol class="list-decimal list-inside mt-2 text-yellow-700 text-sm space-y-1">
            <li>Make sure you're logged in (the protected API button should be enabled)</li>
            <li>Click "Test Protected API" to make a request</li>
            <li>If the token is expired, the system will automatically refresh it and retry</li>
            <li>Watch the console for refresh messages</li>
            <li>You can also manually refresh the token or clear it to test different scenarios</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { createProtectedApiClient } from '../utils/api';

// Define page metadata to use default layout
definePageMeta({
  layout: 'default'
});

// Composables
const { useAuth } = await import('../composables/useAuth');
const { useCsrf } = await import('../composables/useCsrf');

const auth = useAuth();
const csrf = useCsrf();

// State
const loading = ref(false);
const results = ref<Array<{
  action: string;
  success: boolean;
  message: string;
  details?: string;
  timestamp: Date;
}>>([]);

// Computed
const csrfToken = computed(() => csrf.token.value);
const csrfCacheValid = computed(() => csrf.isCacheValid.value);
const lastFetch = computed(() => csrf.lastFetch.value);
const isAuthenticated = computed(() => auth.isAuthenticated.value);
const user = computed(() => auth.user.value);

// API client
const protectedApiClient = createProtectedApiClient();

// Methods
const addResult = (action: string, success: boolean, message: string, details?: string) => {
  results.value.unshift({
    action,
    success,
    message,
    details,
    timestamp: new Date()
  });
  
  // Keep only last 10 results
  if (results.value.length > 10) {
    results.value = results.value.slice(0, 10);
  }
};

const testPublicApi = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/test/public');
    addResult('Public API Test', true, 'Public API call successful', JSON.stringify(response, null, 2));
  } catch (error: any) {
    addResult('Public API Test', false, 'Public API call failed', error?.message || 'Unknown error');
  } finally {
    loading.value = false;
  }
};

const testProtectedApi = async () => {
  loading.value = true;
  try {
    // This will trigger the automatic token refresh if needed
    const response = await protectedApiClient.get('/api/test/protected');
    addResult('Protected API Test', true, 'Protected API call successful', JSON.stringify(response, null, 2));
  } catch (error: any) {
    addResult('Protected API Test', false, 'Protected API call failed', error?.message || 'Unknown error');
  } finally {
    loading.value = false;
  }
};

const forceRefreshToken = async () => {
  loading.value = true;
  try {
    const newToken = await csrf.forceRefresh();
    if (newToken) {
      addResult('Force Token Refresh', true, 'Token refreshed successfully', `New token: ${newToken.substring(0, 20)}...`);
    } else {
      addResult('Force Token Refresh', false, 'Token refresh failed', 'No new token received');
    }
  } catch (error: any) {
    addResult('Force Token Refresh', false, 'Token refresh failed', error?.message || 'Unknown error');
  } finally {
    loading.value = false;
  }
};

const clearToken = async () => {
  loading.value = true;
  try {
    csrf.clearToken();
    addResult('Clear Token', true, 'Token cleared successfully');
  } catch (error: any) {
    addResult('Clear Token', false, 'Failed to clear token', error?.message || 'Unknown error');
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  // Check authentication status
  await auth.checkAuth();
});
</script>
