<template>
  <UCard v-if="!consentGiven" class="fixed bottom-2 left-2 right-2 max-w-6xl mx-auto z-50 shadow-xl">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
      <div class="space-y-2">
        <h3 class="text-center md:text-left md:text-lg font-semibold text-gray-900">We value your privacy</h3>
        <p class="text-xs md:text-sm text-gray-600">
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
          By clicking "Accept All", you consent to our use of cookies.
          <ULink to="/privacy" class="text-primary-600 hover:underline">Cookie Policy</ULink>
        </p>
      </div>
      <div class="flex flex-row justify-center gap-2 flex-shrink-0">
        <UButton
          @click="acceptAll"
          color="primary"
          size="sm"
          label="Accept All"
        />
        <UButton
          @click="acceptNecessary"
          color="neutral"
          variant="outline"
          size="sm"
          label="Necessary Only"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const consentGiven = ref(false);

// Check if user has already given consent
onMounted(() => {
//   if (document) {
//     consentGiven.value = localStorage.getItem('cookieConsent') === 'accepted' || 
//                         localStorage.getItem('cookieConsent') === 'necessary';
//   }
});

const setConsent = (type) => {
  if (document) {
    localStorage.setItem('cookieConsent', type);
    consentGiven.value = true;
    
    // If using analytics, you would initialize it here based on the consent
    if (type === 'accepted') {
      // Initialize analytics, ads, etc.
      console.log('All cookies accepted');
    } else {
      console.log('Only necessary cookies accepted');
    }
  }
};

const acceptAll = () => setConsent('accepted');
const acceptNecessary = () => setConsent('necessary');
</script>
