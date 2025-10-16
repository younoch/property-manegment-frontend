<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-24 w-24 text-red-500" />
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Access Denied
      </h1>
      
      <p class="text-lg text-gray-600 mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <div class="space-y-4">
        <UButton
          to="/app/dashboard"
          variant="primary"
          size="lg"
          class="w-full"
        >
          Go to Dashboard
        </UButton>
        
        <UButton
          @click="handleSignout"
          variant="outline"
          size="lg"
          class="w-full"
        >
          Sign Out
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signout } = useAuthStore();
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
</script>
