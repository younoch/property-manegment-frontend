<template>
  <UModal v-model:open="isOpen" :ui="{ width: 'sm:max-w-md' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
        <h3 class="text-base sm:text-lg font-semibold">Delete Portfolio</h3>
      </div>
    </template>
    
    <template #body>
      <div class="space-y-4 sm:space-y-6">
        <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          This action cannot be undone. This will permanently delete the portfolio <span class="text-primary font-semibold">{{ portfolioName }}</span> and all associated properties, units, leases, and documents.
        </p>
        
        <UFormField 
          :label="`Type ${portfolioName} to confirm`"
          :ui="formFieldUi"
          :error="isConfirmationInvalid ? 'Please type the exact portfolio name to confirm' : ''"
        >
          <UInput 
            v-model="confirmationText" 
            :placeholder="'Type: ' + portfolioName"
            :ui="{ 
              base: 'w-full text-sm sm:text-base',
              color: { white: 'bg-white dark:bg-gray-800' },
              padding: { sm: 'px-3 py-2' },
              size: { sm: 'text-sm' }
            }"
            autofocus
            @keyup.enter="handleConfirm"
          />
        </UFormField>
      </div>
    </template>
    
    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 w-full">
        <UButton 
          color="neutral" 
          variant="ghost"
          size="sm"
          class="mt-2 sm:mt-0 w-full sm:w-auto justify-center"
          :ui="{
            padding: { sm: 'px-4 py-2' }
          }"
          @click="handleCancel"
          :disabled="isDeleting"
        >
          Cancel
        </UButton>
        <UButton 
          color="error" 
          icon="i-lucide-trash"
          size="sm"
          class="w-full sm:w-auto justify-center"
          :ui="{
            padding: { sm: 'px-4 py-2' },
            color: {
              red: 'text-white dark:text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
            }
          }"
          @click="handleConfirm"
          :disabled="isConfirmationInvalid || isDeleting"
          :loading="isDeleting"
        >
          <span class="font-medium">Delete Portfolio</span>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  portfolioName: string
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const isOpen = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const confirmationText = ref('')

const formFieldUi = computed(() => ({
  label: {
    base: 'text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 mb-1.5',
    required: 'sr-only'
  },
  error: 'mt-1.5 text-xs sm:text-sm',
  container: 'mb-1'
}))

const isConfirmationInvalid = computed(() => 
  confirmationText.value !== '' && confirmationText.value !== props.portfolioName
)

const handleConfirm = () => {
  if (isConfirmationInvalid.value) return
  emit('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
// Reset confirmation text when modal is closed
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    confirmationText.value = ''
  }
})
  </script>
  