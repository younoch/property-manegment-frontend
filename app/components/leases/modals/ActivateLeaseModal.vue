<template>
  <UModal :open="openModel" @update:open="val => emit('update:open', val)" title="Activate Lease">
    <template #body>
      <div class="space-y-3">
        <div class="text-sm text-gray-600">Choose what to do on activation.</div>
        <div class="flex items-center gap-3">
          <USwitch v-model="createFirstInvoice" />
          <span class="text-sm">Create first rent invoice now</span>
        </div>
        <div class="flex items-center gap-3">
          <USwitch v-model="createDepositInvoice" :disabled="!allowDeposit" />
          <span class="text-sm" :class="!allowDeposit ? 'text-gray-400' : ''">Create deposit invoice now</span>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <UButton variant="soft" color="neutral" @click="emit('update:open', false)">Cancel</UButton>
        <UButton :loading="loading" icon="i-lucide-file-signature" @click="emit('confirm')">Activate</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean; loading: boolean; createFirstInvoice: boolean; createDepositInvoice: boolean; allowDeposit: boolean }>()
const emit = defineEmits(['update:open','confirm','update:createFirstInvoice','update:createDepositInvoice'])
const createFirstInvoice = computed({
  get:()=>props.createFirstInvoice, set:v=>emit('update:createFirstInvoice', v)
})
const openModel = computed({
   get: () => props.open,
   set: v => emit('update:open', v)
})
const createDepositInvoice = computed({
  get:()=>props.createDepositInvoice, set:v=>emit('update:createDepositInvoice', v)
})
</script>
