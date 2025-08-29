<template>
  <UCard>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex gap-2">
        <UButton v-if="lease?.status==='draft'" :loading="activating" icon="i-lucide-file-signature" @click="$emit('open-activate')">
          Activate
        </UButton>
        <UButton v-if="lease?.status==='active'" variant="soft" color="neutral" icon="i-lucide-calendar-x" @click="$emit('open-end')">
          End Lease
        </UButton>
        <UButton v-if="lease?.status==='active'" variant="soft" color="primary" icon="i-lucide-file-plus" :loading="generatingInvoice" @click="$emit('generate-next')">
          Generate Next Invoice
        </UButton>
        <UButton variant="soft" color="neutral" icon="i-lucide-rotate-cw" :loading="loading" @click="$emit('refresh')">
          Refresh
        </UButton>
      </div>
      <UButton v-if="lease?.status==='active'" variant="soft" color="primary" icon="i-lucide-wallet" @click="onRecordPayment">
        Record Payment
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const emit = defineEmits(['open-activate','open-end','generate-next','refresh','open-payment'])

defineProps<{ 
  lease: any | null; 
  loading: boolean; 
  generatingInvoice: boolean; 
  activating: boolean 
}>()

function onRecordPayment() {
  // Emit with null to indicate a regular payment (not tied to an invoice)
  emit('open-payment', null)
}
</script>
