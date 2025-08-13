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
          <UFormGroup label="Email address" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              required
              :error="errors.email"
              class="w-full"
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
              class="w-full"
            />
          </UFormGroup>
        </div>
        
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 sm:p-4">
          <div class="flex">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div class="ml-2 sm:ml-3">
              <h3 class="text-xs sm:text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>
        
        <div class="pt-2">
          <UButton
            type="submit"
            :loading="loading"
            :disabled="loading"
            class="w-full text-sm sm:text-base"
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
    
    if (result.success) {
      // Redirect to dashboard or intended page
      await router.push('/dashboard');
    } else {
      // Handle error through the store
    }
  } catch (error: any) {
    // Handle error through the store
  }
};
</script>
