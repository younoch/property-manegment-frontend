<template>
  <div class="w-full">
    <div class="text-center mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
        Create your account
      </h2>
      <p class="text-sm sm:text-base text-gray-600">
        Or
        <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
          sign in to your existing account
        </NuxtLink>
      </p>
    </div>
    
    <UCard class="w-full">
      <form @submit.prevent="handleRegister" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div class="sm:col-span-2">
            <UFormGroup label="Full Name" name="name">
              <UInput
                v-model="form.name"
                type="text"
                placeholder="Enter your full name"
                required
                :error="errors.name"
                class="w-full"
              />
            </UFormGroup>
          </div>
          
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
            <UFormGroup label="Phone Number" name="phone">
              <UInput
                v-model="form.phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                :error="errors.phone"
                class="w-full"
              />
            </UFormGroup>
          </div>
          
          <div>
            <UFormGroup label="Password" name="password">
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Create a password"
                required
                :error="errors.password"
                class="w-full"
              />
            </UFormGroup>
          </div>
          
          <div>
            <UFormGroup label="Confirm Password" name="confirmPassword">
              <UInput
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                :error="errors.confirmPassword"
                class="w-full"
              />
            </UFormGroup>
          </div>
          
          <div class="sm:col-span-2">
            <UFormGroup label="Role" name="role">
              <USelect
                v-model="form.role"
                :options="roleOptions"
                placeholder="Select your role"
                required
                :error="errors.role"
                class="w-full"
              />
            </UFormGroup>
          </div>
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
        
        <div v-if="successMessage" class="rounded-md bg-green-50 p-3 sm:p-4">
          <div class="flex">
            <UIcon name="i-heroicons-check-circle" class="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div class="ml-2 sm:ml-3">
              <h3 class="text-xs sm:text-sm font-medium text-green-800">
                {{ successMessage }}
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
            Create Account
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

const { signup, isAuthenticating, currentError } = useAuthStore();
const { isLoggedIn } = useUserStore();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'tenant' as 'tenant' | 'landlord' | 'manager' | 'super_admin'
});

const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: ''
});

const loading = computed(() => isAuthenticating);
const errorMessage = computed(() => currentError);
const successMessage = ref('');

import { ROLE_OPTIONS } from '~/constants';

const roleOptions = ROLE_OPTIONS;

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  };
  
  let isValid = true;
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  }
  
  if (!form.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email';
    isValid = false;
  }
  
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Phone number is required';
    isValid = false;
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  if (!form.value.role) {
    errors.value.role = 'Role is required';
    isValid = false;
  }
  
  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const result = await signup({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      role: form.value.role
    });
    
    if (result.success) {
      successMessage.value = 'Account created successfully! Redirecting to dashboard...';
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      errorMessage.value = result.error || 'Registration failed';
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
