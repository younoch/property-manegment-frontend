<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <UCard 
        v-if="!consentGiven && isMounted" 
        class="fixed bottom-2 left-2 right-2 max-w-6xl mx-auto z-50 shadow-xl"
        :ui="{
          base: 'animate-fade-in-up',
          ring: 'ring-1 ring-primary-500',
          rounded: 'rounded-lg',
          shadow: 'shadow-lg'
        }"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div class="space-y-1.5">
            <h3 class="text-sm md:text-base font-semibold text-gray-900 leading-tight">We value your privacy</h3>
            <p class="text-xs text-gray-600">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
              <span class="block sm:inline">By clicking "Accept All", you consent to our use of cookies. </span>
              <NuxtLink to="/privacy" class="text-primary-700 hover:text-primary-800 font-medium underline underline-offset-2 decoration-2 decoration-primary-600 hover:decoration-primary-800 transition-colors whitespace-nowrap">Cookie Policy</NuxtLink>
            </p>
          </div>
          <div class="flex flex-row justify-end sm:justify-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
            <UButton
              @click="acceptNecessary"
              color="gray"
              variant="ghost"
              size="xs"
              class="text-xs px-2 py-1.5"
              :ui="{ rounded: 'rounded-md' }"
              :loading="isLoading === 'necessary'"
              :disabled="!!isLoading"
            >
              Necessary Only
            </UButton>
            <UButton
              @click="acceptAll"
              color="primary"
              size="xs"
              class="text-xs px-3 py-1.5"
              :ui="{ rounded: 'rounded-md' }"
              :loading="isLoading === 'all'"
              :disabled="!!isLoading"
            >
              Accept All
            </UButton>
          </div>
        </div>
      </UCard>
    </Transition>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const cookieConsent = useCookie('cookieConsent', {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax', // or 'strict' for better security if your site allows it
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false, // Needs to be accessible via client-side JS
  path: '/'
});

const consentGiven = ref(true);
const isMounted = ref(false);
const isLoading = ref(null);

defineOptions({
  inheritAttrs: false
});

// Check if user has already given consent
onMounted(() => {
  isMounted.value = true;
  nextTick(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(checkConsent, { timeout: 2000 });
    } else {
      setTimeout(checkConsent, 500);
    }
  });
});

const checkConsent = () => {
  consentGiven.value = !!cookieConsent.value;
};

const setConsent = async (type) => {
  try {
    isLoading.value = type === 'all' ? 'all' : 'necessary';
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update the cookie
    cookieConsent.value = type;
    
    if (type === 'accepted') {
      requestIdleCallback(() => {
        console.log('All cookies accepted');
      });
    } else {
      console.log('Only necessary cookies accepted');
    }
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    consentGiven.value = true;
  } catch (error) {
    console.error('Error setting cookie consent:', error);
  } finally {
    isLoading.value = null;
  }
};

const acceptAll = () => setConsent('accepted');
const acceptNecessary = () => setConsent('necessary');
</script>

<style scoped>
.animate-fade-in-up {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
}
</style>
