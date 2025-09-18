<template>
  <div class="w-full">
    <div class="text-center mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
        Sign in to your account
      </h2>
      <p class="text-sm sm:text-base text-gray-600">
        Or
        <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
          create a new account
        </NuxtLink>
      </p>
    </div>
    
    <UCard class="w-full">
      <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email address</label>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
            :error="errors.email"
            class="w-full"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <UInput
            v-model="form.password"
            placeholder="Enter your password"
            :type="showPassword ? 'text' : 'password'"
            required
            :error="errors.password"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </div>
        
        <div class="pt-2">
          <UButton
            type="submit"
            :loading="loading"
            :disabled="loading"
            class="w-full text-sm sm:text-base flex items-center justify-center"
            size="lg"
          >
            Sign in
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
});

const { signin, isAuthenticating, currentError } = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);

const loading = computed(() => isAuthenticating);
const errorMessage = computed(() => currentError);

const validateForm = () => {
  errors.value = { email: '', password: '' };
  let isValid = true;
  
  if (!form.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email';
    isValid = false;
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  }
  
  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  try {
    const result = await signin({
      email: form.value.email,
      password: form.value.password
    });
    
    console.log('Login result:', result);
    
    if (result?.success) {
      // Wait a small amount of time to ensure stores are updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the user store to check authentication state
      const userStore = useUserStore();
      console.log('User store after login:', {
        isAuthenticated: userStore.isAuthenticated,
        user: userStore.user
      });
      
      if (userStore.isAuthenticated) {
        console.log('User is authenticated, redirecting to dashboard');
        // Use window.location to force a full page reload and ensure all state is properly initialized
        window.location.href = '/dashboard';
      } else {
        console.error('User not authenticated after successful login');
      }
    } else {
      console.error('Login failed:', result?.error || 'Unknown error');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    // Clear any potentially invalid auth state on error
    const userStore = useUserStore();
    userStore.clearUser();
    userStore.clearStorage();
  }
};
</script>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
