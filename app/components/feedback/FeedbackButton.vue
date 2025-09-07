<template>
  <div class="fixed bottom-6 right-6 z-50">
    <UPopover 
      v-model:open="isOpen"
      :popper="{ placement: 'top-end' }" 
      :ui="{ content: 'w-80 sm:w-96' }"
      @close="resetForm"
    >
      <UButton
        icon="i-heroicons-chat-bubble-left-right"
        color="primary"
        size="lg"
        square
        variant="solid"
        aria-label="Send feedback"
        class="shadow-lg hover:shadow-xl transition-shadow"
      />

      <template #content>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-3">Send us your feedback</h3>
          <UForm :state="form" :validate="validate" @submit.prevent="onSubmit" class="space-y-3">
            <UFormField name="message" :error="errors.message">
              <UTextarea
                v-model="form.message"
                placeholder="Share your thoughts, suggestions, or report an issue..."
                :rows="4"
                required
                class="w-full"
              />
            </UFormField>

            <UFormField 
              v-if="!user"
              name="email" 
              :error="errors.email"
              class="mb-2"
            >
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Your email (optional)"
                class="w-full"
              />
              <template #help>
                <div class="text-xs text-gray-500 mt-1">So we can get back to you if needed</div>
              </template>
            </UFormField>

            <UButton 
              type="submit" 
              color="primary"
              block
              :loading="submitting"
              :disabled="!form.message.trim()"
              class="mt-2"
            >
              Send Feedback
            </UButton>
          </UForm>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useToast } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { object, string, minLength, pipe, safeParse, optional, email as isEmail } from 'valibot'
import { createProtectedApiClient } from '~/utils/api'

interface FeedbackForm {
  message: string
  email?: string
  pageUrl: string
}

const { user } = useAuth()
const toast = useToast()
const api = createProtectedApiClient()
const isOpen = ref(false)
const submitting = ref(false)
const errors = reactive<Record<string, string | undefined>>({})

const form = reactive<FeedbackForm>({
  message: '',
  email: user.value?.email || '',
  pageUrl: typeof window !== 'undefined' ? window.location.href : ''
})

// Form validation schema
const Schema = object({
  message: pipe(string(), minLength(1, 'Please enter your feedback')),
  email: optional(pipe(string(), isEmail('Please enter a valid email address'))),
  pageUrl: string()
})

const validate = (state: FeedbackForm) => {
  const result = safeParse(Schema, state)
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

const resetForm = () => {
  form.message = ''
  form.email = user.value?.email || ''
  form.pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  Object.keys(errors).forEach((k) => delete errors[k])
}

const onSubmit = async (event: Event) => {
  event.preventDefault()
  
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Validate form
  const validation = validate(form)
  if (Object.keys(validation).length > 0) {
    Object.assign(errors, validation)
    return
  }

  submitting.value = true
  
  try {
    const payload = {
      user_id: user.value?.id,
      user_email: user.value?.email || form.email,
      message: form.message.trim(),
      page_url: form.pageUrl
    }

    // Send feedback to API
    const response = await api.post('/feedback', payload)
    
    // Show success message
    toast.add({
      title: 'Feedback Sent',
      description: 'Thank you for your feedback!',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
    
    // Reset form and close popover
    resetForm()
    isOpen.value = false
  } catch (error: any) {
    console.error('Failed to submit feedback:', error)
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to send feedback. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    submitting.value = false
  }
}
</script>
