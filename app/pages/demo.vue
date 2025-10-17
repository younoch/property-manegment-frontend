<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Authentication System Demo
        </h1>
        <p class="text-lg text-gray-600">
          Test the authentication system and see how it works
        </p>
      </div>

      <!-- Authentication Status -->
      <UCard class="mb-8">
        <template #header>
          <h2 class="text-xl font-semibold">Authentication Status</h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="font-medium">Status:</span>
            <UBadge
              :color="isLoggedIn ? 'green' : 'red'"
              variant="soft"
            >
              {{ isLoggedIn ? 'Authenticated' : 'Not Authenticated' }}
            </UBadge>
          </div>
          
                      <div v-if="isLoggedIn && currentUser" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-medium">User:</span>
                <span>{{ currentUser.name }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium">Email:</span>
                <span>{{ currentUser.email }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium">Role:</span>
                <UBadge :color="getRoleColor(currentUser.role)" variant="soft">
                  {{ currentUser.role }}
                </UBadge>
              </div>
            </div>
            
            <div v-if="isAuthenticating" class="flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin mr-2" />
            <span>Checking authentication...</span>
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Authentication</h3>
          </template>
          
          <div class="space-y-3">
            <UButton
              v-if="!isLoggedIn"
              to="/auth/login"
              variant="primary"
              class="w-full"
            >
              Sign In
            </UButton>
            
            <UButton
              v-if="!isLoggedIn"
              to="/auth/signup"
              variant="outline"
              class="w-full"
            >
              Create Account
            </UButton>
            
            <UButton
              v-if="isLoggedIn"
              @click="handleSignout"
              variant="outline"
              color="red"
              class="w-full"
            >
              Sign Out
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Navigation</h3>
          </template>
          
          <div class="space-y-3">
            <UButton
              to="/"
              variant="ghost"
              class="w-full justify-start"
            >
              <UIcon name="i-heroicons-home" class="h-4 w-4 mr-2" />
              Home
            </UButton>
            
            <UButton
              v-if="isLoggedIn"
              to="/app/dashboard"
              variant="ghost"
              class="w-full justify-start"
            >
              <UIcon name="i-heroicons-chart-bar" class="h-4 w-4 mr-2" />
              Dashboard
            </UButton>
            
            <UButton
              to="/about"
              variant="ghost"
              class="w-full justify-start"
            >
              <UIcon name="i-heroicons-information-circle" class="h-4 w-4 mr-2" />
              About
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Role Testing -->
      <UCard v-if="isLoggedIn">
        <template #header>
          <h3 class="text-xl font-semibold">Role-Based Access Testing</h3>
        </template>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 border rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-2">Tenant Access</div>
              <UBadge
                :color="hasRole('tenant') ? 'green' : 'gray'"
                variant="soft"
              >
                {{ hasRole('tenant') ? 'Allowed' : 'Denied' }}
              </UBadge>
            </div>
            
            <div class="text-center p-4 border rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-2">Landlord Access</div>
              <UBadge
                :color="hasRole('landlord') ? 'green' : 'gray'"
                variant="soft"
              >
                {{ hasRole('landlord') ? 'Allowed' : 'Denied' }}
              </UBadge>
            </div>
            
            <div class="text-center p-4 border rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-2">Manager Access</div>
              <UBadge
                :color="hasRole('manager') ? 'green' : 'gray'"
                variant="soft"
              >
                {{ hasRole('manager') ? 'Allowed' : 'Denied' }}
              </UBadge>
            </div>
            
            <div class="text-center p-4 border rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-2">Admin Access</div>
              <UBadge
                :color="hasRole('super_admin') ? 'green' : 'gray'"
                variant="soft"
              >
                {{ hasRole('super_admin') ? 'Allowed' : 'Denied' }}
              </UBadge>
            </div>
          </div>
          
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Your current role: <span class="font-medium">{{ userRole || 'None' }}</span>
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentUser, isLoggedIn, userRole, hasRole } = useUserStore();
const { signout, isAuthenticating } = useAuthStore();
const router = useRouter();

const handleSignout = async () => {
  try {
    const result = await signout();
    if (result.success) {
      // Redirect to home page after successful logout
      await navigateTo('/');
    } else {
      console.error('Logout failed:', result.error);
      // Still redirect even if logout fails
      await navigateTo('/');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if logout fails
    await navigateTo('/');
  }
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
</script>
