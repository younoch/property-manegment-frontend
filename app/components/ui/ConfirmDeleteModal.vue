<template>
  <BaseModal
    :open="isOpen"
    :title="title || 'Delete'"
    :prevent-close="false"
    :ui="{ width: 'w-full sm:max-w-md' }"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #body>
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-alert-triangle" class="mt-0.5 text-error" />
        <div>
          <p class="text-sm">{{ message || 'Are you sure you want to delete this item? This action cannot be undone.' }}</p>
          <p v-if="details" class="text-xs text-muted mt-1">{{ details }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <UButton color="neutral" variant="soft" @click="onCancel" :disabled="loading">Cancel</UButton>
        <UButton color="error" :loading="loading" @click="onConfirm">
          <UIcon name="i-lucide-trash" class="mr-1" /> Delete
        </UButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  open: boolean
  title?: string
  message?: string
  details?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

const isOpen = computed(() => props.open)
const loading = computed(() => props.loading || false)

function onCancel() {
  emit('cancel')
  emit('update:open', false)
}

function onConfirm() {
  emit('confirm')
}
</script>
