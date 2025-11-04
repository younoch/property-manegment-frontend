<template>
  <div class="w-full">
    <div class="text-center mb-2 sm:mb-4">
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
        <div ref="googleButton" class="w-full"></div>
      </div>

      <div class="relative mb-3 sm:mb-4">
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
            <UInput v-model="form.name" type="text" placeholder="Enter your full name" required class="w-full"/>
          </UFormField>

          <UFormField label="Email Address" name="email" :error="errors.email">
            <UInput v-model="form.email" type="email" placeholder="Enter your email" required class="w-full"/>
          </UFormField>

          <UFormField label="Phone Number" name="phone" :error="errors.phone">
            <UInput v-model="form.phone" type="tel" placeholder="Enter your phone number" required class="w-full"/>
          </UFormField>

          <UFormField label="Password" name="password" :error="errors.password" class="relative">
            <UInputGroup class="relative">
              <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required class="w-full pr-10"/>
              <UButton type="button" variant="ghost" color="gray"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                class="absolute right-1 top-1/2 -translate-y-1/2"
                @click="showPassword = !showPassword" :padded="false" tabindex="-1"/>
            </UInputGroup>
          </UFormField>

          <UFormField label="Confirm Password" name="confirmPassword" :error="errors.confirmPassword" class="relative">
            <UInputGroup class="relative">
              <UInput v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••" required class="w-full pr-10"/>
              <UButton type="button" variant="ghost" color="gray"
                :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                class="absolute right-1 top-1/2 -translate-y-1/2"
                @click="showConfirmPassword = !showConfirmPassword" :padded="false" tabindex="-1"/>
            </UInputGroup>
          </UFormField>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-3 sm:p-4">
          <div class="flex">
            <UIcon name="i-heroicons-check-circle" class="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0 mt-0.5"/>
            <div class="ml-2 sm:ml-3">
              <h3 class="text-xs sm:text-sm font-medium text-green-800">{{ successMessage }}</h3>
            </div>
          </div>
        </div>

        <div>
          <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-2">
            <div class="text-sm w-full sm:w-auto text-center sm:text-left">
              <span class="text-gray-600">Already have an account?</span>
              <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors whitespace-nowrap">
                Sign in
              </NuxtLink>
            </div>
            <UButton type="submit" :loading="loading" :disabled="loading" class="w-full sm:w-auto px-6 py-2.5 sm:py-2 text-sm sm:text-base justify-center" size="md">
              Create Account
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useUserStore } from '~/stores/user';
import { useToast, useRuntimeConfig } from '#imports';
import { useGoogleSignIn } from '~/composables/useGoogleSignIn';

definePageMeta({ layout: 'auth', middleware: 'guest' });
useHead({
  title: 'Sign Up | LeaseDirector',
  meta: [
    { name: 'description', content: 'Sign up for a LeaseDirector account to manage tenants, invoices, and property payments securely.' }
  ]
});

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const navigateTo = router.push;
const toast = useToast();

// Form state
const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'landlord'
});
const errors = ref<Record<string, string>>({});
const loading = ref(false);
const successMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Google Sign-In
const { googleButton, loadingGoogle, handleGoogleButtonClick, renderGoogleButton } = useGoogleSignIn();

onMounted(() => {
  if (googleButton.value) renderGoogleButton(googleButton.value, { width: 300 });
});

// Validation
const validate = (state: any) => {
  const issues: Array<{ path: string[], message: string }> = [];
  if (!state.name?.trim()) issues.push({ path: ['name'], message: 'Name is required' });
  if (!state.email?.trim()) issues.push({ path: ['email'], message: 'Email is required' });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) issues.push({ path: ['email'], message: 'Invalid email' });
  if (!state.password) issues.push({ path: ['password'], message: 'Password is required' });
  else if (state.password.length < 6) issues.push({ path: ['password'], message: 'Password must be at least 6 characters' });
  if (state.password !== state.confirmPassword) issues.push({ path: ['confirmPassword'], message: 'Passwords do not match' });
  Object.keys(errors.value).forEach(key => errors.value[key] = '');
  issues.forEach(issue => { if(issue.path?.[0]) errors.value[issue.path[0]] = issue.message });
  return issues;
};

// Handle email/password registration
const handleRegister = async () => {
  if (validate(form.value).length) return;

  try {
    loading.value = true;
    successMessage.value = '';
    const result = await authStore.signup(form.value);
    if (result.success) {
      successMessage.value = 'Account created successfully! Redirecting...';
      if(result.user) userStore.setUser(result.user);
      setTimeout(() => navigateTo('/app/dashboard'), 1200);
    } else {
      toast.add({ title: 'Error', description: result.error || 'Registration failed', color: 'error', icon: 'i-heroicons-exclamation-circle' });
    }
  } catch (error: any) {
    toast.add({ title: 'Error', description: error?.message || 'Unexpected error occurred', color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    loading.value = false;
  }
};
</script>

<style>
::-ms-reveal { display: none; }
</style>
