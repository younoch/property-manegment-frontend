<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </NuxtLink>
        </p>
      </div>
      
      <UCard class="mt-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <UFormGroup label="Email address" name="email">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                required
                :error="errors.email"
              />
            </UFormGroup>
          </div>
          
          <div>
            <UFormGroup label="Password" name="password">
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                required
                :error="errors.password"
              />
            </UFormGroup>
          </div>
          
          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ errorMessage }}
                </h3>
              </div>
            </div>
          </div>
          
          <div>
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading"
              class="w-full"
              size="lg"
            >
              Sign in
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
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
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const result = await signin({
      email: form.value.email,
      password: form.value.password
    });
    
    if (result.success) {
      // Redirect to dashboard or intended page
      await router.push('/dashboard');
    } else {
      errorMessage.value = result.error || 'Login failed';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
