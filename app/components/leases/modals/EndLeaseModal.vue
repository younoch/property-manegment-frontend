<template>
  <UModal :open="openModel" @update:open="val => emit('update:open', val)" title="End Lease">
    <template #body>
      <div class="space-y-3">
        <UFormField label="End Date"><UInput v-model="endDate" type="date" /></UFormField>
        <p class="text-xs text-gray-500">Tenant will move out on this date. Future invoices should stop.</p>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <UButton variant="soft" color="neutral" @click="emit('update:open', false)">Cancel</UButton>
        <UButton color="rose" icon="i-lucide-calendar-x" :loading="loading" @click="emit('confirm', endDate)">End Lease</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean; loading: boolean }>()
const emit = defineEmits(['update:open','confirm'])
const openModel = computed({
  get: () => props.open,
  set: v => emit('update:open', v)
})
const endDate = ref(new Date().toISOString().slice(0,10))
</script>
