<template>
  <div class="bg-white shadow rounded-lg p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div class="flex-shrink-0 flex justify-center sm:justify-start">
        <UIcon name="i-heroicons-user-circle" class="h-12 w-12 text-gray-400" />
      </div>
      <div class="flex-1 min-w-0 text-center sm:text-left">
        <h3 class="text-lg font-medium text-gray-900">
          {{ displayName }}
        </h3>
        <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
        <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
          <UBadge :color="getRoleColor(userRole)" variant="soft">
            {{ userRole }}
          </UBadge>
          <span class="text-xs text-gray-400">
            Last active: {{ formatLastActivity }}
          </span>
        </div>
      </div>
      <div class="flex-shrink-0 flex justify-center sm:justify-end">
        <UButton
          @click="handleSignout"
          variant="outline"
          color="red"
          size="sm"
          :loading="isAuthenticating"
          class="w-full sm:w-auto"
        >
          Sign Out
        </UButton>
      </div>
    </div>
    
    <!-- User Stats -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="text-xl sm:text-2xl font-bold text-primary-600">
          {{ isAdmin ? 'Admin' : 'User' }}
        </div>
        <div class="text-xs sm:text-sm text-gray-500">Access Level</div>
      </div>
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="text-xl sm:text-2xl font-bold text-green-600">
          {{ isLandlord ? 'Landlord' : isTenant ? 'Tenant' : isManager ? 'Manager' : 'User' }}
        </div>
        <div class="text-xs sm:text-sm text-gray-500">Role Type</div>
      </div>
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="text-xl sm:text-2xl font-bold text-blue-600">
          {{ isSessionValid ? 'Active' : 'Expired' }}
        </div>
        <div class="text-xs sm:text-sm text-gray-500">Session Status</div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="mt-6 border-t pt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3 text-center sm:text-left">Quick Actions</h4>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <UButton
          v-if="isAdmin"
          variant="outline"
          size="sm"
          @click="handleAdminAction"
          class="w-full sm:w-auto"
        >
          Admin Panel
        </UButton>
        <UButton
          v-if="isLandlord"
          variant="outline"
          size="sm"
          @click="handleLandlordAction"
          class="w-full sm:w-auto"
        >
          Manage Properties
        </UButton>
        <UButton
          v-if="isTenant"
          variant="outline"
          size="sm"
          @click="handleTenantAction"
          class="w-full sm:w-auto"
        >
          View Properties
        </UButton>
        <UButton
          variant="outline"
          size="sm"
          @click="handleProfileEdit"
          class="w-full sm:w-auto"
        >
          Edit Profile
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import stores
const { 
  currentUser, 
  displayName, 
  userRole, 
  isAdmin, 
  isLandlord, 
  isTenant, 
  isManager,
  isSessionValid,
  lastActivity
} = useUserStore();

const { signout, isAuthenticating } = useAuthStore();

// Computed properties
const formatLastActivity = computed(() => {
  if (!lastActivity) return 'Never';
  return new Date(lastActivity).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Methods
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

import { getRoleColor } from '~/constants';

// ... existing code ...

const handleAdminAction = () => {
  // Handle admin-specific action
  console.log('Admin action triggered');
};

const handleLandlordAction = () => {
  // Handle landlord-specific action
  console.log('Landlord action triggered');
};

const handleTenantAction = () => {
  // Handle tenant-specific action
  console.log('Tenant action triggered');
};

const handleProfileEdit = () => {
  // Handle profile editing
  console.log('Profile edit triggered');
};
</script>
