<template>
  <div class="w-full">
    <div class="text-center mb-2 sm:mb-4">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
        Sign in to your account
      </h2>
      <p class="text-sm sm:text-base text-gray-600">
        Or
        <NuxtLink to="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
          create a new account
        </NuxtLink>
      </p>
    </div>
    
    <UCard class="w-full">
      <!-- Social Login Buttons -->
      <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div class="w-full">
          <div 
            ref="googleButton"
            class="w-full"
          >
            <UButton
              block
              color="white"
              :loading="loadingGoogle"
              :disabled="loadingGoogle || loadingFacebook"
              class="py-2.5 sm:py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors justify-center text-sm sm:text-base"
              @click="handleGoogleButtonClick"
            >
              <template #leading>
                <div v-if="!loadingGoogle" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3">
                  <svg viewBox="0 0 24 24" class="w-full h-full">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M5.86 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.68-2.84z"
                    ></path>
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.68 2.84c.86-2.6 3.28-4.53 6.14-4.53z"
                    ></path>
                  </svg>
                </div>
              </template>
              {{ loadingGoogle ? 'Signing in with Google...' : 'Continue with Google' }}
            </UButton>
          </div>
        </div>
        
        <!-- <UButton
          block
          color="white"
          :loading="loadingFacebook"
          :disabled="loadingGoogle || loadingFacebook"
          class="py-2.5 sm:py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors justify-center text-sm sm:text-base"
          @click="signInWithFacebook"
        >
          <template #leading>
            <svg v-if="!loadingFacebook" class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </template>
          {{ loadingFacebook ? 'Signing in with Facebook...' : 'Continue with Facebook' }}
        </UButton> -->
      </div>
      
      <div class="relative mb-3 sm:mb-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="px-3 bg-white text-gray-500 text-xs sm:text-sm">Or continue with email</span>
        </div>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
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
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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
        
        <div>
          <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-2">
            <div class="text-sm w-full sm:w-auto text-center sm:text-left">
              <span class="text-gray-600">
                Don't have an account? 
              </span>
              <NuxtLink to="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500 transition-colors whitespace-nowrap">
                Sign up
              </NuxtLink>
            </div>
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading"
              class="w-full sm:w-auto px-6 py-2.5 sm:py-2 text-sm sm:text-base justify-center"
              size="md"
            >
              Sign in
            </UButton>
          </div>
        </div>
      </form>
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

const config = useRuntimeConfig();
const router = useRouter();
const navigateTo = router.push;

const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();

// Form state
const form = ref({ email: '', password: '' });
const errors = ref({ email: '', password: '' });
const showPassword = ref(false);
const loading = computed(() => authStore.isAuthenticating);

// Google Sign-In composable
const { googleButton, loadingGoogle, renderButton, handleButtonClick } = useGoogleSignIn();

// Render Google button on mount
onMounted(() => {
  if (googleButton.value) {
    renderButton(googleButton.value, { width: 300 });
  }
});

// Validate form fields
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

// Handle traditional login
const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    const result = await authStore.signin({
      email: form.value.email,
      password: form.value.password
    });

    if (result?.success) {
      // Wait briefly to ensure store is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (userStore.isAuthenticated) {
        await navigateTo('/app/dashboard');
      } else {
        toast.add({
          title: 'Sign In Error',
          description: result?.error || 'Unknown error occurred during sign in',
          color: 'error',
          icon: 'i-heroicons-exclamation-circle'
        });
        console.error('User not authenticated after login');
      }
    } else {
      toast.add({
        title: 'Sign In Failed',
        description: result?.error || 'Invalid email or password',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      });
      console.error('Login failed:', result?.error || 'Unknown error');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    toast.add({
      title: 'Sign In Error',
      description: error?.message || 'Unexpected error occurred',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    });
    userStore.clearUser();
    userStore.clearStorage();
  }
};

// Optional: Facebook login redirect
const loadingFacebook = ref(false);
const signInWithFacebook = async () => {
  try {
    loadingFacebook.value = true;
    window.location.href = '/api/auth/facebook';
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.message || 'Failed to sign in with Facebook',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
      duration: 5000
    });
  } finally {
    loadingFacebook.value = false;
  }
};

// Page metadata
useHead({
  title: 'Login | LeaseDirector: Property Management Software',
  meta: [
    { name: 'description', content: 'Log in to your LeaseDirector account to manage tenants, invoices, and property payments securely. Built for small landlords and property managers.' }
  ]
});
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
});
</script>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
  display: none;
}
</style>
