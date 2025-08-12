<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Pinia Stores Test</h1>
      
      <!-- User Store Test -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold">User Store Test</h2>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Is Logged In:</label>
              <UBadge :color="isLoggedIn ? 'green' : 'red'" variant="soft">
                {{ isLoggedIn ? 'Yes' : 'No' }}
              </UBadge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Loading:</label>
              <UBadge :color="isAuthenticating ? 'yellow' : 'green'" variant="soft">
                {{ isAuthenticating ? 'Yes' : 'No' }}
              </UBadge>
            </div>
          </div>
          
          <div v-if="currentUser">
            <label class="block text-sm font-medium text-gray-700">Current User:</label>
            <pre class="bg-gray-100 p-3 rounded text-sm">{{ JSON.stringify(currentUser, null, 2) }}</pre>
          </div>
          
          <div v-if="userRole">
            <label class="block text-sm font-medium text-gray-700">User Role:</label>
            <UBadge :color="getRoleColor(userRole)" variant="soft">
              {{ userRole }}
            </UBadge>
          </div>
        </div>
      </UCard>
      
      <!-- Auth Store Test -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold">Auth Store Test</h2>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Is Authenticating:</label>
              <UBadge :color="isAuthenticating ? 'yellow' : 'green'" variant="soft">
                {{ isAuthenticating ? 'Yes' : 'No' }}
              </UBadge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Auth Check:</label>
              <span class="text-sm text-gray-600">{{ formatLastAuthCheck }}</span>
            </div>
          </div>
          
          <div v-if="currentError">
            <label class="block text-sm font-medium text-gray-700">Current Error:</label>
            <div class="bg-red-50 border border-red-200 rounded p-3">
              <p class="text-red-800">{{ currentError }}</p>
            </div>
          </div>
        </div>
      </UCard>
      
      <!-- Actions Test -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Store Actions Test</h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex space-x-3">
            <UButton
              @click="testCheckAuth"
              variant="outline"
              :loading="isAuthenticating"
            >
              Check Auth Status
            </UButton>
            
            <UButton
              @click="testClearError"
              variant="outline"
              color="gray"
            >
              Clear Error
            </UButton>
            
            <UButton
              v-if="isLoggedIn"
              @click="testSignout"
              variant="outline"
              color="red"
            >
              Test Signout
            </UButton>
          </div>
          
          <div class="text-sm text-gray-600">
            <p>Click the buttons above to test store actions. Check the console for logs.</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import stores
const { 
  currentUser, 
  isLoggedIn, 
  userRole,
  isAuthenticating: userLoading
} = useUserStore();

const { 
  isAuthenticating, 
  currentError, 
  lastCheck,
  checkAuth,
  clearError,
  signout
} = useAuthStore();

// Computed properties
const formatLastAuthCheck = computed(() => {
  if (!lastCheck) return 'Never';
  return new Date(lastCheck).toLocaleString();
});

// Methods
const testCheckAuth = async () => {
  console.log('Testing checkAuth...');
  const result = await checkAuth();
  console.log('Check auth result:', result);
};

const testClearError = () => {
  console.log('Testing clearError...');
  clearError();
  console.log('Error cleared');
};

const testSignout = async () => {
  console.log('Testing signout...');
  const result = await signout();
  console.log('Signout result:', result);
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'tenant': return 'blue';
    case 'landlord': return 'green';
    case 'manager': return 'yellow';
    case 'super_admin': return 'red';
    default: return 'gray';
  }
};

// Check auth on page load
onMounted(async () => {
  console.log('Test page mounted, checking auth...');
  await testCheckAuth();
});
</script>


