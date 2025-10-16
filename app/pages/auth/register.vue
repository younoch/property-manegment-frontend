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
      <!-- Social Login Buttons -->
      <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <UButton
          block
          color="white"
          class="py-2.5 sm:py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors justify-center text-sm sm:text-base"
          @click="signInWithGoogle"
        >
          <template #leading>
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
            />
          </template>
          Continue with Google
        </UButton>
        
        <UButton
          block
          color="white"
          class="py-2.5 sm:py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors justify-center text-sm sm:text-base"
          @click="signInWithFacebook"
        >
          <template #leading>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </template>
          Continue with Facebook
        </UButton>
      </div>
      
      <div class="relative mb-4 sm:mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="px-3 bg-white text-gray-500 text-xs sm:text-sm">Or continue with email</span>
        </div>
      </div>
      
      <UForm :state="form" :validate="validate" @submit="handleRegister" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <UFormField label="Full Name" name="name" :error="errors.name" class="sm:col-span-2">
            <UInput
              v-model="form.name"
              type="text"
              placeholder="Enter your full name"
              required
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Email Address" name="email" :error="errors.email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Phone Number" name="phone" :error="errors.phone">
            <UInput
              v-model="form.phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              class="w-full"
            />
          </UFormField>
          
          <!-- <UFormField label="Role" name="role" :error="errors.role">
            <USelect
              v-model="form.role"
              :items="roleOptions"
              placeholder="Select your role"
              required
              class="w-full"
            />
          </UFormField> -->
          
          <UFormField label="Password" name="password" :error="errors.password" class="relative">
            <UInputGroup class="relative">
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pr-10"
              />
              <UButton
                type="button"
                variant="ghost"
                color="gray"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                class="absolute right-1 top-1/2 -translate-y-1/2"
                @click="showPassword = !showPassword"
                :padded="false"
                tabindex="-1"
              />
            </UInputGroup>
          </UFormField>
          
          <UFormField label="Confirm Password" name="confirmPassword" :error="errors.confirmPassword" class="relative">
            <UInputGroup class="relative">
              <UInput
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pr-10"
              />
              <UButton
                type="button"
                variant="ghost"
                color="gray"
                :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                class="absolute right-1 top-1/2 -translate-y-1/2"
                @click="showConfirmPassword = !showConfirmPassword"
                :padded="false"
                tabindex="-1"
              />
            </UInputGroup>
          </UFormField>
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
        
        <div class="pt-2 sm:pt-3">
          <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-2">
            <div class="text-sm w-full sm:w-auto text-center sm:text-left">
              <span class="text-gray-600">
                Already have an account? 
              </span>
              <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors whitespace-nowrap">
                Sign in
              </NuxtLink>
            </div>
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading"
              class="w-full sm:w-auto px-6 py-2.5 sm:py-2 text-sm sm:text-base justify-center"
              size="md"
            >
              Create Account
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ROLE_OPTIONS } from '~/constants';
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
});

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

// Destructure store values with proper typing
const { signup } = authStore;
const isAuthenticating = computed(() => authStore.isAuthenticating);
const currentError = computed(() => authStore.currentError);

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: 'landlord' as 'tenant' | 'landlord' | 'manager' | 'super_admin'
});

interface FormErrors {
  [key: string]: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: string;
}

const errors = ref<FormErrors>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: ''
});

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Password visibility toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Watch for auth store changes
watchEffect(() => {
  errorMessage.value = currentError.value || '';
  loading.value = isAuthenticating.value;
});

// Import constants


const roleOptions = ROLE_OPTIONS;

const validate = (state: any) => {
  const issues: Array<{ path: string[]; message: string }> = [];
  
  if (!state.name?.trim()) {
    issues.push({ path: ['name'], message: 'Name is required' });
  }
  
  if (!state.email) {
    issues.push({ path: ['email'], message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    issues.push({ path: ['email'], message: 'Please enter a valid email' });
  }
  
  if (!state.password) {
    issues.push({ path: ['password'], message: 'Password is required' });
  } else if (state.password.length < 6) {
    issues.push({ path: ['password'], message: 'Password must be at least 6 characters' });
  }
  
  if (state.password !== state.confirmPassword) {
    issues.push({ path: ['confirmPassword'], message: 'Passwords do not match' });
  }
  
  if (!state.role) {
    issues.push({ path: ['role'], message: 'Role is required' });
  }
  
  // Clear previous errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = '';
  });
  
  // Set new errors
  issues.forEach(issue => {
    if (issue.path?.[0]) {
      errors.value[issue.path[0]] = issue.message;
    }
  });
  
  return issues;
};

const handleRegister = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const result = await signup({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone,
      role: form.value.role,
    });
    
    if (result?.success) {
      successMessage.value = 'Account created successfully! Redirecting to dashboard...';
      
      // Update the user store with the returned user data
      if (result.user) {
        userStore.setUser(result.user);
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('/app/dashboard');
      }, 1500);
    } else {
      errorMessage.value = result?.error || 'Registration failed';
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
