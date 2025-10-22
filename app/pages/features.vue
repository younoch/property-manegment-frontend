<script setup lang="ts">

// SEO: Set up meta for this page
definePageMeta({ layout: 'public' })
useHead({
  title: 'Features - LeaseDirector Property Management Software',
  meta: [
    { 
      name: 'description', 
      content: 'Discover powerful property management features including lease tracking, rent collection, maintenance requests, and financial reporting. Built for small landlords.' 
    },
    { property: 'og:title', content: 'Features - LeaseDirector Property Management Software' },
    { property: 'og:description', content: 'Discover powerful property management features designed specifically for small landlords and property managers.' },
  ]
});

const features = [
  {
    icon: 'i-heroicons-document-text',
    title: 'Lease Management',
    description: 'Streamline your lease lifecycle with automated tracking, digital signatures, and custom alerts for renewals and expirations.',
    color: 'primary',
    details: [
      'Digital lease creation with customizable templates',
      'Automated renewal reminders 60/30/15 days in advance',
      'Electronic signatures for paperless processing',
      'Lease term tracking with visual calendar',
      'Document version control and history'
    ],
    stat: '85% reduction in lease admin time'
  },
  {
    icon: 'i-heroicons-currency-dollar',
    title: 'Rent Collection',
    description: 'Automate rent collection with multiple payment options, late fee enforcement, and detailed payment tracking.',
    color: 'teal',
    details: [
      'Recurring payment scheduling',
      'ACH, credit/debit, and online payments',
      'Automated late fee calculations',
      'Payment reminders and receipts',
      'Rent roll and payment history'
    ],
    stat: '99% on-time payment rate'
  },
  {
    icon: 'i-heroicons-wrench-screwdriver',
    title: 'Maintenance Tracking',
    description: 'Efficiently manage maintenance requests with automated workflows and vendor coordination.',
    color: 'amber',
    details: [
      'Tenant-submitted maintenance requests',
      'Priority-based ticket management',
      'Vendor assignment and tracking',
      'Photo documentation uploads',
      'Preventive maintenance scheduling'
    ],
    stat: '60% faster resolution times'
  },
  {
    icon: 'i-heroicons-document-chart-bar',
    title: 'Financial Reporting',
    description: 'Comprehensive financial insights with customizable reports and tax documentation.',
    color: 'indigo',
    details: [
      'Income/expense tracking',
      'Year-end tax documentation',
      'Custom report builder',
      'Portfolio performance analytics',
      'Export to accounting software'
    ],
    stat: '8+ hours saved monthly on accounting'
  },
  {
    icon: 'i-heroicons-chat-bubble-left-right',
    title: 'Tenant Portal',
    description: '24/7 self-service access for tenants to manage their accounts and communications.',
    color: 'violet',
    details: [
      'Online rent payments',
      'Maintenance request submission',
      'Document access and e-signing',
      'Message center',
      'Lease and payment history'
    ],
    stat: '40% reduction in tenant inquiries'
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Document Storage',
    description: 'Secure, organized storage for all property-related documents with role-based access.',
    color: 'emerald',
    details: [
      'Unlimited document storage',
      'Automatic backup and versioning',
      'Custom categories and tags',
      'Bulk upload and organization',
      'Secure sharing with team members'
    ],
    stat: '100% compliance with data protection'
  }
];

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access to all features. No credit card required. Cancel anytime.'
  },
  {
    question: 'Can I manage multiple properties?',
    answer: 'Yes! LeaseDirector supports an unlimited number of properties and units across your portfolio.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level 256-bit encryption and regular backups to keep your data safe.'
  },
  {
    question: 'Do you offer mobile access?',
    answer: 'Yes, our responsive web app works perfectly on all devices, and we have native mobile apps coming soon.'
  }
];

const activeFaq = ref<number | null>(null);

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const scrollToSection = (id: string) => {
  if (process.client) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Intersection Observer for scroll animations
onMounted(() => {
  if (process.client) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

  }
});
</script>

<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-x-hidden">
    <!-- Hero Section -->
    <section class="relative bg-white overflow-hidden py-12 md:py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span class="block">Everything You Need to</span>
          <span class="block text-primary-600">Grow Your Property Portfolio</span>
        </h1>
        <p class="mt-6 text-xl text-gray-600">
          LeaseDirector combines powerful tools with an intuitive interface to help you manage properties efficiently, reduce administrative work, and improve tenant satisfaction.
        </p>
        <div class="mt-8">
          <a href="#" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
            Get Started
          </a>
        </div>
      </div>
    </section>

    <!-- Main Features Grid -->
    <section id="pricing" class="py-6 md:py-12 bg-gray-50 scroll-mt-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 scroll-animate">
          <span class="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-4">COMPREHENSIVE SOLUTIONS</span>
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Grow Your Property Portfolio</h2>
          <p class="text-gray-600 max-w-3xl mx-auto text-lg">LeaseDirector combines powerful tools with an intuitive interface to help you manage properties efficiently, reduce administrative work, and improve tenant satisfaction.</p>
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <div class="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-green-500 mr-2" />
              <span>Bank-grade security</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4 text-blue-500 mr-2" />
              <span>Mobile-friendly interface</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-amber-500 mr-2" />
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="group relative p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden scroll-animate h-full flex flex-col"
            :class="`hover:border-${feature.color}-100`"
          >
            <div class="flex items-start justify-between mb-4">
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0 mt-1"
                :class="`bg-${feature.color}-50 group-hover:bg-${feature.color}-100 text-${feature.color}-600`"
              >
                <UIcon :name="feature.icon" class="w-6 h-6" />
              </div>
              <span class="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 self-center">{{ feature.stat }}</span>
            </div>
            
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 mb-4">{{ feature.description }}</p>
            
            <div class="mt-2 mb-4 space-y-2 flex-grow">
              <div v-for="(detail, i) in feature.details" :key="i" class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span class="text-sm text-gray-600">{{ detail }}</span>
              </div>
            </div>
            
            <div class="mt-auto pt-4 border-t border-gray-100">
              <a href="#" class="inline-flex items-center text-sm font-medium group-hover:text-primary-600 transition-colors">
                See how it works
                <UIcon name="i-heroicons-arrow-right" class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            
            <div 
              class="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              :class="`bg-gradient-to-br from-${feature.color}-50/50 to-transparent`"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8 md:mb-12 scroll-animate">
          <span class="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-3 md:mb-4">SIMPLE WORKFLOW</span>
          <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4 px-2">Streamline Your Property Management in 3 Simple Steps</h2>
          <p class="text-gray-600 max-w-3xl mx-auto text-base md:text-lg px-2">Our intuitive platform makes it easy to manage your properties efficiently, whether you have one unit or hundreds.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div class="group bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 scroll-animate flex flex-col" data-delay="100">
            <!-- Number badge - shown only on desktop -->
            <div class="hidden md:flex w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 items-center justify-center text-xl font-bold mb-5 group-hover:scale-105 transition-all duration-300 border-2 border-primary-100 shadow-sm">
              <span>1</span>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-3">Set Up Your Portfolio</h3>
            <ul class="space-y-2 text-gray-600 mb-4 flex-1 text-sm md:text-base">
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Add properties and units in minutes</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Customize lease templates</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Set up payment methods</span>
              </li>
            </ul>
            <div class="text-sm text-primary-600 font-medium">Average setup time: 15 minutes</div>
          </div>
          
          <div class="group bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 scroll-animate flex flex-col" data-delay="200">
            <!-- Number badge - shown only on desktop -->
            <div class="hidden md:flex w-14 h-14 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 items-center justify-center text-xl font-bold mb-5 group-hover:scale-105 transition-all duration-300 border-2 border-teal-100 shadow-sm">
              <span>2</span>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-3">Onboard Tenants</h3>
            <ul class="space-y-2 text-gray-600 mb-4 flex-1 text-sm md:text-base">
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Send digital lease agreements</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Collect e-signatures</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Set up automatic payments</span>
              </li>
            </ul>
            <div class="text-sm text-teal-600 font-medium">90% of tenants complete onboarding in under 10 minutes</div>
          </div>
          
          <div class="group bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 scroll-animate flex flex-col" data-delay="300">
            <!-- Number badge - shown only on desktop -->
            <div class="hidden md:flex w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 items-center justify-center text-xl font-bold mb-5 group-hover:scale-105 transition-all duration-300 border-2 border-amber-100 shadow-sm">
              <span>3</span>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-3">Manage with Ease</h3>
            <ul class="space-y-2 text-gray-600 mb-4 flex-1 text-sm md:text-base">
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Automated rent collection</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Track maintenance requests</span>
              </li>
              <li class="flex items-start">
                <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Generate financial reports</span>
              </li>
            </ul>
            <div class="text-sm text-amber-600 font-medium">85% of users save 10+ hours monthly</div>
          </div>
        </div>
        
        <div class="mt-10 md:mt-16 bg-gradient-to-r from-primary-600 to-teal-600 rounded-xl md:rounded-2xl p-5 md:p-12 text-white scroll-animate mx-2 sm:mx-4">
          <div class="max-w-3xl mx-auto text-center">
            <h3 class="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to transform your property management?</h3>
            <p class="text-primary-100 text-base sm:text-lg mb-5 md:mb-6 px-2">Join thousands of landlords who trust LeaseDirector to save time and grow their rental business.</p>
            <div class="flex justify-center">
              <UButton 
                to="/auth/signup" 
                color="white" 
                size="lg"
                class="px-8 sm:px-12 bg-white text-primary-700 hover:bg-gray-100 text-sm sm:text-base"
              >
                Start Free Trial
              </UButton>
            </div>
            <p class="mt-3 md:mt-4 text-xs sm:text-sm text-primary-100 opacity-80">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-12 md:py-16 bg-white scroll-mt-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 scroll-animate">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied landlords and property managers</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 scroll-animate">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl mr-4">JD</div>
              <div>
                <h4 class="font-semibold">John D.</h4>
                <div class="flex text-amber-400">
                  <UIcon name="i-heroicons-star" class="w-5 h-5" v-for="i in 5" :key="i" />
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"LeaseDirector has saved me countless hours of paperwork. The rent collection automation is a game-changer!"</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 scroll-animate" data-delay="100">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl mr-4">MS</div>
              <div>
                <h4 class="font-semibold">Maria S.</h4>
                <div class="flex text-amber-400">
                  <UIcon name="i-heroicons-star" class="w-5 h-5" v-for="i in 5" :key="i" />
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"The maintenance tracking system is incredibly intuitive. My tenants love being able to submit requests online."</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 scroll-animate md:col-span-2 lg:col-span-1" data-delay="200">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xl mr-4">RK</div>
              <div>
                <h4 class="font-semibold">Robert K.</h4>
                <div class="flex text-amber-400">
                  <UIcon name="i-heroicons-star" class="w-5 h-5" v-for="i in 5" :key="i" />
                  <UIcon name="i-heroicons-star" class="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"The financial reporting has made tax season so much easier. I can generate all the reports I need with one click."</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-12 md:py-16 bg-gray-50 border-t border-gray-100 scroll-mt-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-12 scroll-animate">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-gray-600">Can't find the answer you're looking for? <a href="/contact" class="text-primary-600 hover:underline">Contact our support team</a></p>
        </div>
        
        <div class="max-w-3xl mx-auto space-y-3 md:space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden scroll-animate"
            :data-delay="(index * 100) + 100"
          >
            <button 
              @click="toggleFaq(index)" 
              class="w-full flex justify-between items-center p-6 text-left focus:outline-none"
            >
              <h3 class="text-lg font-medium text-gray-900">{{ faq.question }}</h3>
              <UIcon 
                name="i-heroicons-chevron-down" 
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'transform rotate-180': activeFaq === index }"
              />
            </button>
            <div 
              class="px-6 pb-6 pt-0 overflow-hidden transition-all duration-300 ease-in-out"
              :class="{ 'max-h-0': activeFaq !== index, 'max-h-48 mb-4': activeFaq === index }"
            >
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Features -->
    <section class="py-12 md:py-16 bg-white border-t border-gray-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold">Powerful features for modern landlords</h2>
          <p class="mt-2 text-gray-600 max-w-2xl mx-auto">Designed to save you time and reduce the headaches of property management</p>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <UIcon name="i-heroicons-bolt" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">Automated Rent Collection</h3>
                <p class="mt-1 text-gray-600">Set up automatic rent payments and never chase late payments again.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <UIcon name="i-heroicons-clock" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">Time Zone Aware</h3>
                <p class="mt-1 text-gray-600">Accurate due dates and late fees based on your property's timezone.</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">Bank-Grade Security</h3>
                <p class="mt-1 text-gray-600">Your data is encrypted and protected with industry-leading security measures.</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <img src="https://picsum.photos/800/500?random=10" alt="Dashboard preview" class="rounded-lg w-full h-auto">
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-3xl mx-auto bg-gradient-to-r from-primary-50 to-teal-50 rounded-2xl p-6 md:p-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to simplify your property management?</h2>
          <p class="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">Join hundreds of landlords who trust LeaseDirector to manage their properties efficiently.</p>
          <div class="flex justify-center">
            <UButton 
              to="/auth/signup" 
              color="primary"
              size="xl"
              class="px-12"
            >
              Get Started Free
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
/* Base animations */
.animate-slow-float {
  animation: slow-float 12s ease-in-out infinite;
}

.animate-slow-float-rev {
  animation: slow-float 14s ease-in-out infinite reverse;
}

@keyframes slow-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Scroll animations */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-animate.animate-fadeInUp {
  opacity: 1;
  transform: translateY(0);
}

/* Add delay based on data-delay attribute */
.scroll-animate[data-delay="100"] { transition-delay: 100ms; }
.scroll-animate[data-delay="200"] { transition-delay: 200ms; }
.scroll-animate[data-delay="300"] { transition-delay: 300ms; }
.scroll-animate[data-delay="400"] { transition-delay: 400ms; }

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Scroll to top button transition */
#scrollToTop {
  transition: all 0.3s ease-in-out;
}

/* Feature card hover effect */
.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

/* FAQ transition */
.faq-answer {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
</style>

