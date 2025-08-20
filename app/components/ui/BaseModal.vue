<template>
  <UModal
    v-model:open="openProxy"
    :title="title"
    :prevent-close="preventClose"
    :close="close"
    :ui="computedUi"
  >
    <template #header>
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 v-if="title" class="text-lg font-semibold">{{ title }}</h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="onClose"
          />
        </div>
      </slot>
    </template>

    <template #body>
      <slot name="body">
        <slot />
      </slot>
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ModalCloseConfig {
  color?: string
  variant?: string
  class?: string
}

const props = defineProps<{
  open: boolean
  title?: string
  preventClose?: boolean
  close?: ModalCloseConfig
  width?: string
  bodyPadding?: string
  headerPadding?: string
  ui?: Record<string, string>
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const openProxy = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const onClose = () => {
  openProxy.value = false
}

const computedUi = computed(() => {
  const base: Record<string, string> = {
    // Width of the modal panel
    width: props.width || 'w-full sm:max-w-4xl',
    // Header/body paddings
    header: props.headerPadding || 'p-3 min-h-12',
    body: props.bodyPadding || 'p-3'
  }
  return { ...base, ...(props.ui || {}) }
})
</script>


