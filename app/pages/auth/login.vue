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
        <UButton
          block
          color="white"
          :loading="loadingGoogle"
          :disabled="loadingGoogle || loadingFacebook"
          class="py-2.5 sm:py-3 px-4 border border-gray-300 hover:bg-gray-50 transition-colors justify-center text-sm sm:text-base"
          @click="initiateGoogleSignIn"
        >
          <template #leading>
            <img 
              v-if="!loadingGoogle"
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
            />
          </template>
          {{ loadingGoogle ? 'Signing in with Google...' : 'Continue with Google' }}
        </UButton>
        
        <UButton
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
        </UButton>
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
import { useAuthStore } from '~/stores/auth';
import { useToast } from '#imports';
import { useRuntimeConfig } from '#imports';

// Initialize stores and composables
const authStore = useAuthStore();
const toast = useToast();
const config = useRuntimeConfig();

// Google Sign-In
const googleClientId = config.public.googleClientId;
let googleAuth: any = null;

// Initialize Google Sign-In
const initGoogleAuth = () => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleSignIn
      });
    };
    document.head.appendChild(script);
  }
};

// Initialize on component mount
onMounted(() => {
  initGoogleAuth();
});

useHead({
  title: 'Login | LeaseDirector: Rent & Lease Management Software',
  meta: [
    { name: 'description', content: 'Log in to your LeaseDirector account to manage tenants, invoices, and property payments securely. Built for small landlords and property managers.' }
  ]
})
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
});

const form = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);

const loading = computed(() => authStore.isAuthenticating);
const loadingGoogle = ref(false);
const loadingFacebook = ref(false);

// Initiate Google Sign-In
const initiateGoogleSignIn = () => {
  try {
    // @ts-ignore
    google.accounts.id.prompt();
    
    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { 
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    );
    
    // @ts-ignore
    google.accounts.id.prompt();
  } catch (error) {
    console.error('Error initializing Google Sign-In:', error);
  }
};

// Handle Google Sign-In response
const handleGoogleSignIn = async (response: any) => {
  try {
    loadingGoogle.value = true;
    
    // Get the ID token from the Google Sign-In response
    const { credential } = response;
    
    if (!credential) {
      throw new Error('No credential received from Google');
    }
    
    // Call the store method with the ID token
    const result = await authStore.signInWithGoogle({
      token: credential,
      role: 'tenant' // Default role for login
    });
    
    if (result.success && result.user) {
      // Show success message
      toast.add({
        title: 'Success',
        description: 'Successfully signed in with Google',
        color: 'success',
        icon: 'i-heroicons-check-circle',
        duration: 3000
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('/app/dashboard');
      }, 1000);
    } else {
      throw new Error(result.error || 'Failed to sign in with Google');
    }
    
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    toast.add({
      title: 'Error',
      description: error?.message || 'Failed to sign in with Google',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
      duration: 5000
    });
  } finally {
    loadingGoogle.value = false;
  }
};

const signInWithFacebook = async () => {
  try {
    loadingFacebook.value = true;
    
    // Redirect to your backend's Facebook OAuth endpoint
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
    const result = await authStore.signin({
      email: form.value.email,
      password: form.value.password
    });
    
    if (result?.success) {
      // Wait a small amount of time to ensure stores are updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the user store to check authentication state
      const userStore = useUserStore();
      
      if (userStore.isAuthenticated) {
        // Show success toast
        toast.add({
          title: 'Sign In Successful',
          description: 'Welcome back! Redirecting to your dashboard...',
          color: 'success',
          icon: 'i-heroicons-check-circle'
        });
        // Use Nuxt navigation to avoid a full page reload
        await navigateTo('/app/dashboard');
      } else {
        toast.add({
          title: 'Sign In Error',
          description: result?.error || 'An unknown error occurred during sign in',
          color: 'error',
          icon: 'i-heroicons-exclamation-circle'
        });
        console.error('User not authenticated after successful login');
      }
    } else {
      // Show error toast for failed login
      toast.add({
        title: 'Sign In Failed',
        description: result?.error || 'Invalid email or password. Please try again.',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      });
      console.error('Login failed:', result?.error || 'Unknown error');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    // Show error toast for unexpected errors
    toast.add({
      title: 'Sign In Error',
      description: error?.message || 'An unexpected error occurred. Please try again.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    });
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
