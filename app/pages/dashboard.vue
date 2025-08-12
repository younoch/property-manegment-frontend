<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <UButton
                variant="ghost"
                class="flex items-center space-x-2"
                @click="userMenuOpen = !userMenuOpen"
              >
                <UIcon name="i-heroicons-user-circle" class="h-6 w-6" />
                <span>{{ displayName }}</span>
                <UIcon name="i-heroicons-chevron-down" class="h-4 w-4" />
              </UButton>
              
              <!-- Dropdown Menu -->
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <NuxtLink 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="userMenuOpen = false"
                >
                  Profile
                </NuxtLink>
                <NuxtLink 
                  to="/settings" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="userMenuOpen = false"
                >
                  Settings
                </NuxtLink>
                <div class="border-t border-gray-100"></div>
                <button
                  @click="handleSignout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Welcome back, {{ displayName }}!
            </h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>You are logged in as a <span class="font-medium text-primary-600">{{ userRole }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="mt-8 px-4 sm:px-0">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Properties Card -->
          <UCard>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-home" class="h-8 w-8 text-primary-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Properties
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.properties }}
                  </dd>
                </dl>
              </div>
            </div>
          </UCard>

          <!-- Tenants Card -->
          <UCard>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-users" class="h-8 w-8 text-green-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Active Tenants
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.tenants }}
                  </dd>
                </dl>
              </div>
            </div>
          </UCard>

          <!-- Revenue Card -->
          <UCard>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-yellow-600" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Monthly Revenue
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    ${{ stats.revenue.toLocaleString() }}
                  </dd>
                </dl>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-8 px-4 sm:px-0">
        <UCard>
          <template #header>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
          </template>
          
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivities" :key="activity.id" class="relative pb-8">
                <div v-if="index !== recentActivities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                      <UIcon :name="activity.icon" class="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-500">
                        {{ activity.description }}
                      </p>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                      <time :datetime="activity.date">{{ formatDate(activity.date) }}</time>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </UCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'nuxt/app'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'

definePageMeta({
  middleware: 'auth'
});

const { currentUser, displayName, userRole, hasRole } = useUserStore();
const { signout, isAuthenticating } = useAuthStore();
const router = useRouter();

// Mock data - replace with real API calls
const stats = ref({
  properties: 12,
  tenants: 8,
  revenue: 15420
});

const recentActivities = ref([
  {
    id: 1,
    description: 'New tenant application submitted for Unit 3B',
    icon: 'i-heroicons-user-plus',
    date: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    description: 'Maintenance request completed for Unit 2A',
    icon: 'i-heroicons-wrench-screwdriver',
    date: '2024-01-14T15:30:00Z'
  },
  {
    id: 3,
    description: 'Rent payment received from Unit 1C',
    icon: 'i-heroicons-currency-dollar',
    date: '2024-01-14T09:15:00Z'
  },
  {
    id: 4,
    description: 'Property inspection scheduled for tomorrow',
    icon: 'i-heroicons-calendar',
    date: '2024-01-13T14:20:00Z'
  }
]);

const userMenuOpen = ref(false);

// Close menu when clicking outside
const closeUserMenu = () => {
  userMenuOpen.value = false;
};

// Close menu when route changes
watch(() => router.currentRoute.value.fullPath, () => {
  userMenuOpen.value = false;
});

const handleSignout = async () => {
  try {
    const result = await signout();
    if (result.success) {
      // Redirect to home page after successful logout
      await router.push('/');
    } else {
      console.error('Logout failed:', result.error);
      // Still redirect even if logout fails
      await router.push('/');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if logout fails
    await router.push('/');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
