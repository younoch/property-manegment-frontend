<template>
  <UModal :open="openModel" @update:open="val => emit('update:open', val)" title="Record Payment">
    <template #body>
      <UForm @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Amount"><UInput v-model.number="form.amount" type="number" min="0.01" step="0.01" /></UFormField>
          <UFormField label="Method">
            <USelect v-model="form.method" :items="methods"/>
          </UFormField>
          <UFormField label="Date"><UInput v-model="form.at" type="date" /></UFormField>
          <UFormField label="Reference"><UInput v-model="form.reference" placeholder="Optional" /></UFormField>
          <UFormField class="sm:col-span-2" label="Notes"><UTextarea v-model="form.notes" :rows="3" /></UFormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <UButton variant="soft" color="neutral" @click="emit('update:open', false)">Cancel</UButton>
          <UButton type="submit" :loading="loading" icon="i-lucide-check-circle">Save</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean; loading: boolean }>()
const emit = defineEmits(['update:open','submit'])
const openModel = computed({
  get: () => props.open,
  set: v => emit('update:open', v)
})
const form = reactive({ amount: null as number|null, method: 'cash', at: new Date().toISOString().slice(0,10), reference: '', notes: '' })
const methods = [{label:'Cash',value:'cash'},{label:'Bank',value:'bank'},{label:'Mobile',value:'mobile'},{label:'Other',value:'other'}]
function onSubmit() {
  if (!form.amount || form.amount <= 0) return
  if (!form.at) return
  emit('submit', { ...form })
}
</script>
