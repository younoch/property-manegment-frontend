<script setup lang="ts">
const props = defineProps<{
  prefill: { portfolioId?: string; propertyId?: string; unitId?: string }
  unitInfo: any | null
  tenants: Array<{ id: string; first_name: string; last_name: string; phone?: string | null }>
  details: {
    start_date: string
    end_date: string
    rent: number
    deposit: number
    billing_day: number
    grace_days: number
    late_fee_flat: number
    late_fee_percent: number
    notes: string
  }
  loading: boolean
}>()

const emit = defineEmits<{
  back: []
  cancel: []
  activate: [opts: { createFirstInvoice: boolean; createDepositInvoice: boolean }]
}>()

const createFirstInvoice = ref(true)
const createDepositInvoice = ref(true)

const fmtBDT = (n: number | string | null | undefined) =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(n))
</script>

<template>
  <UCard>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium">Unit</div>
        <div class="text-sm text-gray-600">
          Portfolio #{{ prefill.portfolioId }} · Property #{{ prefill.propertyId }} · Unit #{{ prefill.unitId }}
        </div>
        <div v-if="unitInfo" class="text-sm text-gray-600 mt-1">
          Label: {{ unitInfo.label }} · Market Rent: {{ fmtBDT(unitInfo.market_rent) }}
        </div>
      </div>

      <div>
        <div class="text-sm font-medium">Tenants</div>
        <ul class="text-sm text-gray-600 list-disc list-inside">
          <li v-for="t in tenants" :key="t.id">
            {{ t.first_name }} {{ t.last_name }} <span v-if="t.phone">· {{ t.phone }}</span>
          </li>
        </ul>
      </div>

      <div>
        <div class="text-sm font-medium">Dates</div>
        <div class="text-sm text-gray-600">{{ details.start_date }} → {{ details.end_date }}</div>
      </div>

      <div>
        <div class="text-sm font-medium">Finance</div>
        <div class="text-sm text-gray-600">
          Rent: {{ fmtBDT(details.rent) }} | Deposit: {{ fmtBDT(details.deposit) }}
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-4">
      <USwitch v-model="createFirstInvoice" />
      <span class="text-sm">Create first rent invoice now</span>

      <USwitch v-model="createDepositInvoice" :disabled="!details.deposit || details.deposit <= 0" />
      <span class="text-sm" :class="!details.deposit || details.deposit <= 0 ? 'text-gray-400' : ''">
        Create deposit invoice now
      </span>
    </div>

    <div class="mt-6 flex justify-between">
      <UButton variant="soft" color="neutral" @click="emit('back')">Back</UButton>
      <div class="flex gap-2">
        <UButton variant="soft" color="neutral" @click="emit('cancel')">Cancel</UButton>
        <UButton :loading="loading" icon="i-lucide-file-signature"
                 color="primary"
                 @click="emit('activate', { createFirstInvoice, createDepositInvoice } as any)">
          Activate Lease
        </UButton>
      </div>
    </div>
  </UCard>
</template>
