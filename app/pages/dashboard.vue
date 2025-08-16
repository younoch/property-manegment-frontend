<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Page Title -->
      <div class="px-4 sm:px-0 mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <!-- Welcome Section -->
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Welcome back, {{ displayName }}!
            </h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                You are logged in as a
                <span class="font-medium text-primary-600">
                  {{ userRole ? getRoleByValue(userRole)?.label : 'Unknown Role' }}
                </span>
              </p>
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
import { USER_ROLES, getRoleByValue, getRoleColor, getRolePermissions } from '../constants/roles'

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

// Close menu when route changes
watch(() => router.currentRoute.value.fullPath, () => {
  // Route change handling if needed
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
