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
          
          <UFormField label="Role" name="role" :error="errors.role">
            <USelect
              v-model="form.role"
              :items="roleOptions"
              placeholder="Select your role"
              required
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Password" name="password" :error="errors.password">
            <UInputGroup>
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
              />
            </UInputGroup>
          </UFormField>
          
          <UFormField label="Confirm Password" name="confirmPassword" :error="errors.confirmPassword">
            <UInputGroup>
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
        
        <div class="pt-2">
          <div class="flex items-center justify-between pt-2">
            <div class="text-sm">
              <span class="text-gray-600">
                Already have an account? 
              </span>
              <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Sign in
              </NuxtLink>
            </div>
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading"
              class="px-6 py-2"
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
import { ROLE_OPTIONS } from '~/constants';
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
  password: '',
  confirmPassword: '',
  role: 'landlord' as 'tenant' | 'landlord' | 'manager' | 'super_admin'
});

interface FormErrors {
  [key: string]: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const errors = ref<FormErrors>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

const loading = computed(() => isAuthenticating);
const errorMessage = computed(() => currentError);
const successMessage = ref('');

// Password visibility toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

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
  const validationIssues = validate(form.value);
  if (validationIssues.length > 0) return;
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const result = await signup({
      name: form.value.name,
      email: form.value.email,
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

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
