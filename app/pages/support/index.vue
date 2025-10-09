<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/30 blur-3xl rounded-full"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/30 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white"></div>
    </div>

    <section class="container mx-auto px-4 pt-2 md:pt-20">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-extrabold">Help Center</h1>
          <p class="mt-3 text-gray-600">Find answers and get support</p>
          
          <!-- Search bar -->
          <div class="mt-8 max-w-2xl mx-auto">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Search help articles..."
                class="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                @keyup.enter="searchArticles"
              >
              <button 
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                @click="searchArticles"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Popular Topics -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900">Popular Topics</h2>
          <div class="mt-6 grid md:grid-cols-2 gap-6">
            <div 
              v-for="(topic, index) in popularTopics" 
              :key="index"
              class="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              @click="navigateToTopic(topic.id)"
            >
              <div class="flex items-center">
                <div class="p-3 rounded-lg" :class="topic.bgColor">
                  <component :is="topic.icon" class="h-6 w-6 text-white" />
                </div>
                <h3 class="ml-4 text-lg font-medium text-gray-900">{{ topic.title }}</h3>
              </div>
              <p class="mt-3 text-gray-600">{{ topic.description }}</p>
              <div class="mt-4 flex items-center text-sm text-primary-600">
                <span>Learn more</span>
                <svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div class="mt-6 space-y-4">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="border-b border-gray-200 pb-4"
            >
              <button 
                class="w-full flex justify-between items-center text-left py-3 focus:outline-none"
                @click="toggleFaq(index)"
              >
                <span class="font-medium text-gray-900">{{ faq.question }}</span>
                <svg 
                  class="h-5 w-5 text-gray-500 transform transition-transform duration-200" 
                  :class="{ 'rotate-180': openFaq === index }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                v-show="openFaq === index"
                class="mt-2 text-gray-600"
                v-html="faq.answer"
              ></div>
            </div>
          </div>
        </div>

        <!-- Contact Support -->
        <div class="mt-16 p-8 bg-primary-50 rounded-2xl text-center">
          <h2 class="text-2xl font-bold text-gray-900">Still need help?</h2>
          <p class="mt-2 text-gray-600">Our support team is here to assist you</p>
          <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink 
              to="/contact" 
              class="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </NuxtLink>
            <a 
              href="mailto:support@leasedirector.app" 
              class="px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Email Us
            </a>
          </div>
          <p class="mt-4 text-sm text-gray-500">Average response time: 2 hours</p>
        </div>

        <div class="h-16"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '#imports';

// Icons
const UserIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  `
};

const DocumentTextIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
};

const CreditCardIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  `
};

const CogIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
};

// Data
const searchQuery = ref('');
const openFaq = ref<number | null>(null);

const popularTopics = [
  {
    id: 'account',
    title: 'Account Management',
    description: 'Manage your profile, password, and account settings',
    icon: UserIcon,
    bgColor: 'bg-blue-500'
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    description: 'Update payment methods, view invoices, and manage your subscription',
    icon: CreditCardIcon,
    bgColor: 'bg-green-500'
  },
  {
    id: 'leases',
    title: 'Managing Leases',
    description: 'Create, edit, and manage your property leases and tenants',
    icon: DocumentTextIcon,
    bgColor: 'bg-purple-500'
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and how to resolve them',
    icon: CogIcon,
    bgColor: 'bg-orange-500'
  }
];

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your inbox.'
  },
  {
    question: 'How do I add a new property?',
    answer: 'To add a new property, go to the Properties section in your dashboard and click the "Add Property" button. Fill in the required details and save.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal for subscription payments.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time by going to Account Settings > Billing and clicking on "Cancel Subscription". Your subscription will remain active until the end of the current billing period.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest. We use industry-standard security measures to protect your information.'
  }
];

// Methods
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index;
};

const searchArticles = () => {
  if (searchQuery.value.trim()) {
    // In a real app, this would trigger a search API call
    console.log('Searching for:', searchQuery.value);
  }
};

const navigateToTopic = (topicId: string) => {
  // In a real app, this would navigate to the specific help article
  console.log('Navigating to topic:', topicId);
  // Example: navigateTo(`/help/${topicId}`)
};

// Set page metadata
useHead({
  title: 'LeaseDirector — Help Center',
  meta: [
    { name: 'description', content: 'Get help with LeaseDirector. Find answers to common questions, troubleshooting guides, and contact our support team.' }
  ]
});
</script>

<style scoped>
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Ensure sections have proper spacing when navigated to */
section {
  scroll-margin-top: 2rem;
}
</style>
