<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">CSRF Protection Demo</h1>
        <p class="text-lg text-gray-600">
          This page demonstrates the CSRF protection system in action
        </p>
      </div>

      <!-- CSRF Status Card -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">CSRF Token Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl mb-2">
              {{ hasToken ? '🟢' : '🔴' }}
            </div>
            <div class="font-semibold text-gray-900">Token Available</div>
            <div class="text-sm text-gray-600">
              {{ hasToken ? 'Yes' : 'No' }}
            </div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl mb-2">
              {{ loading ? '🔄' : '✅' }}
            </div>
            <div class="font-semibold text-gray-900">Status</div>
            <div class="text-sm text-gray-600">
              {{ loading ? 'Loading...' : 'Ready' }}
            </div>
          </div>
          
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl mb-2">
              {{ error ? '⚠️' : '✅' }}
            </div>
            <div class="font-semibold text-gray-900">Error</div>
            <div class="text-sm text-gray-600">
              {{ error ? 'Yes' : 'None' }}
            </div>
          </div>
        </div>
        
        <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="text-red-800 text-sm">
            <strong>Error:</strong> {{ error }}
          </div>
        </div>
      </div>

      <!-- Token Management -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Token Management</h2>
        <div class="flex flex-wrap gap-3">
          <button
            @click="handleGetToken"
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Get CSRF Token
          </button>
          
          <button
            @click="handleRefreshToken"
            :disabled="loading || !hasToken"
            class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Refresh Token
          </button>
          
          <button
            @click="handleClearToken"
            :disabled="!hasToken"
            class="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            Clear Token
          </button>
        </div>
      </div>

      <!-- Request Testing -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Request Testing</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-800">Protected Request</h3>
            <p class="text-sm text-gray-600">
              This request includes CSRF token and should succeed if authenticated.
            </p>
            <button
              @click="handleTestProtectedRequest"
              :disabled="!hasToken || loading"
              class="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Test Protected Request
            </button>
          </div>
          
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-800">Unprotected Request</h3>
            <p class="text-sm text-gray-600">
              This request doesn't need CSRF protection (GET request).
            </p>
            <button
              @click="handleTestUnprotectedRequest"
              class="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Test Unprotected Request
            </button>
          </div>
        </div>
        
        <div v-if="requestResult" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <div class="text-sm">
            <strong>Result:</strong> {{ requestResult }}
          </div>
        </div>
      </div>

      <!-- Rent & Lease Management Demo -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Rent & Lease Management Demo</h2>
        <p class="text-gray-600 mb-4">
          This section demonstrates how CSRF protection works with actual API endpoints.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-800">Create Property</h3>
            <input
              v-model="propertyForm.title"
              placeholder="Property Title"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="propertyForm.price"
              type="number"
              placeholder="Price"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="handleCreateProperty"
              :disabled="!hasToken || loading"
              class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Create Property
            </button>
          </div>
          
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-800">Actions</h3>
            <button
              @click="handleFetchProperties"
              :disabled="loading"
              class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Fetch Properties
            </button>
            <button
              @click="handleClearProperties"
              :disabled="properties.length === 0"
              class="w-full px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              Clear Properties
            </button>
          </div>
        </div>
        
        <!-- Properties List -->
        <div v-if="properties.length > 0" class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-800">Properties</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="property in properties"
              :key="property.id"
              class="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-gray-900">{{ property.title }}</h4>
                <button
                  @click="handleDeleteProperty(property.id)"
                  :disabled="!hasToken || loading"
                  class="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  🗑️
                </button>
              </div>
              <div class="text-lg font-bold text-green-600">${{ property.price.toLocaleString() }}</div>
              <div class="text-sm text-gray-600">{{ property.type }}</div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">🏠</div>
          <p>No properties yet. Create one to get started!</p>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-3">How to Test CSRF Protection</h3>
        <ol class="list-decimal list-inside space-y-2 text-blue-800">
          <li>First, get a CSRF token using the "Get CSRF Token" button</li>
          <li>Try making a protected request - it should succeed</li>
          <li>Clear the token and try again - it should fail</li>
          <li>Create properties to see CSRF protection in action</li>
          <li>Check the browser's Network tab to see the X-CSRF-Token header</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// CSRF composable
const { 
  loading, 
  error, 
  hasToken, 
  getToken, 
  refreshToken, 
  clearToken,
  protectedRequest 
} = useCsrf();

// Properties composable
const { 
  properties, 
  createProperty, 
  fetchProperties, 
  deleteProperty 
} = useProperties();

// Local state
const requestResult = ref<string>('');
const propertyForm = ref({
  title: '',
  price: 0
});

// CSRF Token Management
const handleGetToken = async () => {
  try {
    await getToken();
    requestResult.value = '✅ CSRF token obtained successfully!';
  } catch (err: any) {
    requestResult.value = `❌ Failed to get token: ${err.message}`;
  }
};

const handleRefreshToken = async () => {
  try {
    await refreshToken();
    requestResult.value = '✅ CSRF token refreshed successfully!';
  } catch (err: any) {
    requestResult.value = `❌ Failed to refresh token: ${err.message}`;
  }
};

const handleClearToken = () => {
  clearToken();
  requestResult.value = '🗑️ CSRF token cleared!';
};

// Request Testing
const handleTestProtectedRequest = async () => {
  try {
    const response = await protectedRequest('/api/test-protected', {
      method: 'POST',
      body: { test: 'data' }
    });
    requestResult.value = '✅ Protected request successful!';
  } catch (err: any) {
    requestResult.value = `❌ Protected request failed: ${err.message}`;
  }
};

const handleTestUnprotectedRequest = async () => {
  try {
    const response = await $fetch('/api/test-unprotected', {
      method: 'GET'
    });
    requestResult.value = '✅ Unprotected request successful!';
  } catch (err: any) {
    requestResult.value = `❌ Unprotected request failed: ${err.message}`;
  }
};

// Rent & Lease Management
const handleCreateProperty = async () => {
  if (!propertyForm.value.title || !propertyForm.value.price) {
    requestResult.value = '⚠️ Please fill in all fields';
    return;
  }

  try {
    const result = await createProperty({
      title: propertyForm.value.title,
      price: propertyForm.value.price,
      description: 'Demo property created via CSRF-protected API',
      address: '123 Demo Street',
      bedrooms: 2,
      bathrooms: 1,
      area: 1000,
      type: 'apartment'
    });

    if (result.success) {
      requestResult.value = '✅ Property created successfully!';
      propertyForm.value = { title: '', price: 0 };
    } else {
      requestResult.value = `❌ Failed to create property: ${result.error}`;
    }
  } catch (err: any) {
    requestResult.value = `❌ Error creating property: ${err.message}`;
  }
};

const handleFetchProperties = async () => {
  try {
    const result = await fetchProperties();
    if (result.success) {
      requestResult.value = `✅ Fetched ${result.properties?.length || 0} properties`;
    } else {
      requestResult.value = `❌ Failed to fetch properties: ${result.error}`;
    }
  } catch (err: any) {
    requestResult.value = `❌ Error fetching properties: ${err.message}`;
  }
};

const handleDeleteProperty = async (id: string) => {
  try {
    const result = await deleteProperty(id);
    if (result.success) {
      requestResult.value = '✅ Property deleted successfully!';
    } else {
      requestResult.value = `❌ Failed to delete property: ${result.error}`;
    }
  } catch (err: any) {
    requestResult.value = `❌ Error deleting property: ${err.message}`;
  }
};

const handleClearProperties = () => {
  // This is just for demo purposes - in real app you'd want confirmation
  properties.value = [];
  requestResult.value = '🗑️ Properties cleared from local state';
};
</script>
