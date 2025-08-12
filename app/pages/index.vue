<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-blue-50">
    <ClientOnly>
      <template #fallback>
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p class="text-lg text-blue-700">Loading...</p>
        </div>
      </template>

      <div v-if="isAuthenticating" class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p class="text-lg text-blue-700">Loading...</p>
      </div>
      
      <div v-else-if="isLoggedIn" class="text-center">
        <h1 class="text-4xl font-bold text-blue-700 mb-4">Welcome back!</h1>
        <p class="text-lg text-blue-600 mb-6">You are already signed in.</p>
        <UButton to="/dashboard" variant="primary" size="lg">
          Go to Dashboard
        </UButton>
      </div>
      
      <div v-else class="text-center">
        <h1 class="text-4xl font-bold text-blue-700 mb-4">Welcome to Property Management</h1>
        <p class="text-lg text-blue-600 mb-6">Sign in to access your dashboard</p>
        <div class="space-x-4">
          <UButton to="/auth/login" variant="primary" size="lg">
            Sign In
          </UButton>
          <UButton to="/auth/register" variant="outline" size="lg">
            Create Account
          </UButton>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)
const { isAuthenticating, checkAuth } = useAuthStore();

// Check authentication status on page load
onMounted(async () => {
  await checkAuth();
});
</script>
