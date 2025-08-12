<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">CSRF Protection Example</h2>
    
    <!-- CSRF Token Status -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">CSRF Token Status</h3>
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium">Token Available:</span>
          <span :class="hasToken ? 'text-green-600' : 'text-red-600'">
            {{ hasToken ? '✅ Yes' : '❌ No' }}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium">Loading:</span>
          <span :class="loading ? 'text-blue-600' : 'text-gray-600'">
            {{ loading ? '🔄 Loading...' : '✅ Ready' }}
          </span>
        </div>
        <div v-if="error" class="text-red-600 text-sm">
          Error: {{ error }}
        </div>
      </div>
    </div>

    <!-- CSRF Token Actions -->
    <div class="mb-6 space-y-3">
      <h3 class="text-lg font-semibold">CSRF Token Management</h3>
      
      <div class="flex space-x-3">
        <button
          @click="handleGetToken"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Get CSRF Token
        </button>
        
        <button
          @click="handleRefreshToken"
          :disabled="loading || !hasToken"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Refresh Token
        </button>
        
        <button
          @click="handleClearToken"
          :disabled="!hasToken"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Clear Token
        </button>
      </div>
    </div>

    <!-- Protected Request Example -->
    <div class="mb-6 space-y-3">
      <h3 class="text-lg font-semibold">Protected Request Example</h3>
      
      <div class="flex space-x-3">
        <button
          @click="handleTestProtectedRequest"
          :disabled="!hasToken || loading"
          class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test Protected Request
        </button>
        
        <button
          @click="handleTestUnprotectedRequest"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Test Unprotected Request
        </button>
      </div>
      
      <div v-if="requestResult" class="p-3 bg-gray-50 rounded text-sm">
        <strong>Result:</strong> {{ requestResult }}
      </div>
    </div>

    <!-- Property Management Example -->
    <div class="space-y-3">
      <h3 class="text-lg font-semibold">Property Management (CSRF Protected)</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <input
            v-model="propertyForm.title"
            placeholder="Property Title"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="propertyForm.price"
            type="number"
            placeholder="Price"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="space-y-2">
          <button
            @click="handleCreateProperty"
            :disabled="!hasToken || loading"
            class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Create Property
          </button>
          
          <button
            @click="handleFetchProperties"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Fetch Properties
          </button>
        </div>
      </div>
      
      <div v-if="properties.length > 0" class="mt-4">
        <h4 class="font-semibold mb-2">Properties:</h4>
        <div class="space-y-2">
          <div
            v-for="property in properties"
            :key="property.id"
            class="p-3 bg-gray-50 rounded flex justify-between items-center"
          >
            <span>{{ property.title }} - ${{ property.price }}</span>
            <button
              @click="handleDeleteProperty(property.id)"
              :disabled="!hasToken || loading"
              class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

// CSRF composable
const { 
  token, 
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
    requestResult.value = 'CSRF token obtained successfully!';
  } catch (err: any) {
    requestResult.value = `Failed to get token: ${err.message}`;
  }
};

const handleRefreshToken = async () => {
  try {
    await refreshToken();
    requestResult.value = 'CSRF token refreshed successfully!';
  } catch (err: any) {
    requestResult.value = `Failed to refresh token: ${err.message}`;
  }
};

const handleClearToken = () => {
  clearToken();
  requestResult.value = 'CSRF token cleared!';
};

// Protected Request Testing
const handleTestProtectedRequest = async () => {
  try {
    const response = await protectedRequest('/api/test-protected', {
      method: 'POST',
      body: { test: 'data' }
    });
    requestResult.value = 'Protected request successful!';
  } catch (err: any) {
    requestResult.value = `Protected request failed: ${err.message}`;
  }
};

const handleTestUnprotectedRequest = async () => {
  try {
    const response = await $fetch('/api/test-unprotected', {
      method: 'GET'
    });
    requestResult.value = 'Unprotected request successful!';
  } catch (err: any) {
    requestResult.value = `Unprotected request failed: ${err.message}`;
  }
};

// Property Management
const handleCreateProperty = async () => {
  if (!propertyForm.value.title || !propertyForm.value.price) {
    requestResult.value = 'Please fill in all fields';
    return;
  }

  try {
    const result = await createProperty({
      title: propertyForm.value.title,
      price: propertyForm.value.price,
      description: 'Example property',
      address: '123 Example St',
      bedrooms: 2,
      bathrooms: 1,
      area: 1000,
      type: 'apartment'
    });

    if (result.success) {
      requestResult.value = 'Property created successfully!';
      propertyForm.value = { title: '', price: 0 };
    } else {
      requestResult.value = `Failed to create property: ${result.error}`;
    }
  } catch (err: any) {
    requestResult.value = `Error creating property: ${err.message}`;
  }
};

const handleFetchProperties = async () => {
  try {
    const result = await fetchProperties();
    if (result.success) {
      requestResult.value = `Fetched ${result.properties?.length || 0} properties`;
    } else {
      requestResult.value = `Failed to fetch properties: ${result.error}`;
    }
  } catch (err: any) {
    requestResult.value = `Error fetching properties: ${err.message}`;
  }
};

const handleDeleteProperty = async (id: string) => {
  try {
    const result = await deleteProperty(id);
    if (result.success) {
      requestResult.value = 'Property deleted successfully!';
    } else {
      requestResult.value = `Failed to delete property: ${result.error}`;
    }
  } catch (err: any) {
    requestResult.value = `Error deleting property: ${err.message}`;
  }
};
</script>
