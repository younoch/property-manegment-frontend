<template>
  <div class="w-full">
    <div class="text-center mb-4">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Sign in to your account</h2>
      <p class="text-sm text-gray-600">
        Or
        <NuxtLink to="/auth/signup" class="font-medium text-primary-600 hover:text-primary-500">create a new account</NuxtLink>
      </p>
    </div>

    <UCard class="w-full">
      <!-- Google Sign-In Button -->
      <div class="mb-4">
        <div ref="googleButton" class="w-full">
          <UButton
            block
            color="white"
            :loading="loadingGoogle"
            :disabled="loadingGoogle || loadingFacebook"
            class="py-2.5 px-4 border border-gray-300 hover:bg-gray-50 justify-center text-base"
            @click="handleGoogleButtonClick"
          >
            <template #leading>
              <div v-if="!loadingGoogle" class="w-5 h-5 mr-3">
                <svg viewBox="0 0 24 24" class="w-full h-full">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                  <path fill="#FBBC05" d="M5.86 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.68-2.84z"></path>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.68 2.84c.86-2.6 3.28-4.53 6.14-4.53z"></path>
                </svg>
              </div>
            </template>
            {{ loadingGoogle ? 'Signing in with Google...' : 'Continue with Google' }}
          </UButton>
        </div>
      </div>

      <!-- Or separator -->
      <div class="relative mb-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="px-3 bg-white text-gray-500 text-sm">Or continue with email</span>
        </div>
      </div>

      <!-- Email login form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email address</label>
          <UInput v-model="form.email" type="email" placeholder="Enter your email" :error="errors.email" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" :error="errors.password" required>
            <template #trailing>
              <UButton
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </div>
        <UButton type="submit" :loading="loading" block>Sign in</UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useUserStore } from '~/stores/user';
import { useToast } from '#imports';

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

// Google login composable
const { googleButton, loadingGoogle, handleGoogleButtonClick, renderGoogleButton } = useGoogleSignIn();

// Traditional email login
const validateForm = () => {
  errors.value = { email: '', password: '' };
  let valid = true;

  if (!form.value.email) {
    errors.value.email = 'Email is required';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Invalid email';
    valid = false;
  }
  if (!form.value.password) {
    errors.value.password = 'Password is required';
    valid = false;
  }
  return valid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    const result = await authStore.signin(form.value);
    if (result.success && userStore.isAuthenticated) {
      navigateTo('/app/dashboard');
    } else {
      toast.add({ title: 'Login failed', description: result.error || 'Invalid credentials', color: 'error', icon: 'i-heroicons-exclamation-circle' });
    }
  } catch (err: any) {
    toast.add({ title: 'Error', description: err?.message || 'Unexpected error', color: 'error', icon: 'i-heroicons-exclamation-circle' });
  }
};

// Optional: Facebook login placeholder
const loadingFacebook = ref(false);

// Page metadata
useHead({ title: 'Login | LeaseDirector' });
definePageMeta({ layout: 'auth', middleware: 'guest' });
onMounted(() => {
  if (googleButton.value) {
    renderGoogleButton(googleButton.value, { width: 300 });
  }
});
</script>
