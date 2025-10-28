<!-- File: pages/contact.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/40 blur-3xl rounded-full animate-slow-float"></div>
      <div class="absolute top-40 -right-24 w-[28rem] h-[28rem] bg-teal-200/40 blur-3xl rounded-full animate-slow-float-rev"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-primary-100/60 blur-3xl rounded-full"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white"></div>
    </div>

    <!-- Hero / Intro -->
    <section class="container mx-auto px-4 pt-2 md:pt-20 text-center">
      <span class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary-700 font-semibold bg-primary-50 rounded-full px-3 py-1 shadow-sm ring-1 ring-primary-200/60">Contact</span>
      <h1 class="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">We'd love to hear from you</h1>
      <p class="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">Questions about LeaseDirector, pricing, or onboarding? Send us a note—our team usually replies within one business day.</p>
    </section>

    <!-- Contact content -->
    <section class="py-12">
      <div class="container mx-auto px-4 grid lg:grid-cols-3 gap-8 items-start">
        <!-- Contact cards -->
        <div class="space-y-4 lg:order-2">
          <ContactCard icon="i-heroicons-envelope" title="General inquiries" subtitle="hello@leasedirector.app" desc="Anything product or account related."/>
          <ContactCard icon="i-heroicons-lifebuoy" title="Support" subtitle="support@leasedirector.app" desc="Need help? We’re here for you."/>
          <ContactCard icon="i-heroicons-briefcase" title="Sales" subtitle="sales@leasedirector.app" desc="Larger portfolios or custom needs."/>
          <div class="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h3 class="font-semibold">Status</h3>
            <p class="text-sm text-gray-600">Uptime & incidents are posted on our status page.</p>
            <UButton variant="soft" color="gray" class="mt-3" to="/status">View status</UButton>
          </div>
        </div>

        <!-- Form -->
        <div class="lg:col-span-2 lg:order-1">
          <div class="p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm">
            <h2 class="text-2xl font-bold">Send us a message</h2>
            <p class="mt-1 text-sm text-gray-600">Fill out the form and we’ll get back to you soon.</p>
            <UForm :state="state" :validate="validate" class="mt-6 space-y-5" @submit="onSubmit">
              <div class="grid md:grid-cols-2 gap-4">
                <UFormField label="Full name" name="name" :error="errors.name">
                  <UInput v-model="state.name" placeholder="Your name"/>
                </UFormField>
                <UFormField label="Email" name="email" :error="errors.email">
                  <UInput v-model="state.email" type="email" placeholder="you@example.com"/>
                </UFormField>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <UFormField label="Company / Portfolio" name="company">
                  <UInput v-model="state.company" placeholder="Optional"/>
                </UFormField>
                <UFormField label="# of units" name="units">
                  <USelect v-model="state.units" :options="unitOptions" placeholder="Select"/>
                </UFormField>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <UFormField label="Topic" name="topic">
                  <USelect v-model="state.topic" :options="topics" placeholder="Choose a topic"/>
                </UFormField>
                <UFormField label="Priority" name="priority">
                  <USelect v-model="state.priority" :options="priorities" placeholder="Normal"/>
                </UFormField>
              </div>
              <UFormField label="Message" name="message" :error="errors.message">
                <UTextarea v-model="state.message" placeholder="How can we help?" :rows="6"/>
              </UFormField>
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <UButton type="submit" color="primary" size="lg" :loading="submitting">Send message</UButton>
                <p v-if="submitted" class="text-sm text-primary-700">Thanks! We received your message and will reply soon.</p>
              </div>
            </UForm>
          </div>
        </div>
      </div>
    </section>

    <!-- Map / offices (sample) -->
    <section class="py-4">
      <div class="container mx-auto px-4">
        <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white/70 backdrop-blur">
          <img src="https://picsum.photos/500/300?random=10" alt="Map to our office" class="w-full h-64 md:h-96 object-cover"/>
        </div>
      </div>
    </section>

    <!-- FAQ (short) -->
    <section class="py-16">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-2xl md:text-3xl font-bold text-center">Before you send</h2>
        <div class="mt-6 grid md:grid-cols-2 gap-4">
          <UAccordion :items="faqItemsLeft" color="primary" variant="soft"/>
          <UAccordion :items="faqItemsRight" color="primary" variant="soft"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { object, string, minLength, email, safeParse, pipe } from 'valibot'
import { defineComponent } from 'vue'
import { useHead } from '#imports'

definePageMeta({ layout: 'public' })
// Page metadata
useHead({
  title: 'Contact | LeaseDirector: Rental Management Software',
  meta: [
    { name: 'description', content: 'Contact LeaseDirector for product questions, pricing, onboarding, or support. We usually respond within one business day.' }
  ]
})

// Local contact card component
const ContactCard = defineComponent({
  name: 'ContactCard',
  props: { icon: String, title: String, subtitle: String, desc: String },
  template: `<div class='p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-sm'>
    <div class='flex items-start gap-3'>
      <UIcon :name="icon" class='text-primary-600 mt-1'/>
      <div>
        <h3 class='font-semibold'>{{ title }}</h3>
        <p class='text-sm text-primary-700'>{{ subtitle }}</p>
        <p class='text-sm text-gray-600 mt-1'>{{ desc }}</p>
      </div>
    </div>
  </div>`
})

// Form state
const state = reactive({
  name: '',
  email: '',
  company: '',
  units: '',
  topic: '',
  priority: 'Normal',
  message: '',
})

const unitOptions = ['1-2', '3-10', '11-20', '21-50', '51+']
const topics = ['Product question', 'Billing', 'Onboarding', 'Bug report', 'Partnership']
const priorities = ['Normal', 'High']

// Validation schema using Valibot
const Schema = object({
  name: pipe(string(), minLength(1, 'Please enter your name')),
  email: pipe(string(), email('Please enter a valid email address')),
  message: pipe(string(), minLength(10, 'Please enter a message (at least 10 characters)'))
})

const errors = reactive<Record<string, string | undefined>>({})
const submitting = ref(false)
const submitted = ref(false)

// Validation function
const validate = (formState: any) => {
  const result = safeParse(Schema, formState)
  if (result.success) {
    Object.keys(errors).forEach((k) => delete errors[k])
    return []
  }
  Object.keys(errors).forEach((k) => delete errors[k])
  result.issues.forEach((issue: any) => {
    const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0]?.key : undefined
    if (path && typeof path === 'string') errors[path] = issue.message
  })
  return result.issues
}

async function onSubmit() {
  const validationResult = validate({
    name: state.name,
    email: state.email,
    message: state.message
  })
  
  if (validationResult.length > 0) return
  
  submitting.value = true
  try {
    // TODO: Replace with your API endpoint or email integration
    // await $fetch('/api/contact', { method: 'POST', body: state })
    await new Promise(r => setTimeout(r, 900))
    submitted.value = true
  } catch (error: any) {
    console.error('Form submission error:', error)
  } finally {
    submitting.value = false
  }
}

const faqItemsLeft = [
  { label: 'How fast do you reply?', content: 'We aim to respond within one business day.' },
  { label: 'Can you help me migrate?', content: 'Yes—send us a CSV or your current format and we’ll assist.' },
  { label: 'Do you offer demos?', content: 'Yes—book a live demo and we’ll walk you through LeaseDirector.' }
]

const faqItemsRight = [
  { label: 'Is there a free plan?', content: 'Yes—our Starter plan is free for up to 2 units.' },
  { label: 'Where are you hosted?', content: 'We run on secure cloud infrastructure with daily backups.' },
  { label: 'Do you support receipts?', content: 'Receipts PDF is on our roadmap; payments are recorded today.' }
]
</script>

<style scoped>
@keyframes slow-float { 0%{transform:translateY(0)} 50%{transform:translateY(-18px)} 100%{transform:translateY(0)} }
.animate-slow-float { animation: slow-float 12s ease-in-out infinite; }
.animate-slow-float-rev { animation: slow-float 14s ease-in-out infinite reverse; }
</style>

<!-- SAMPLE IMAGE ASSETS TO PREPARE/REPLACE LATER (Contact page)
/ images/contact/map-sample.jpg
-->
