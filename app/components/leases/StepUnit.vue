<script setup lang="ts">
const props = defineProps<{
  unitInfo: any | null
  unitLoading: boolean
  unitError: string | null
  canLeaseThisUnit: boolean
}>()

const emit = defineEmits<{
  retry: []
  cancel: []
  next: []
}>()

const fmtBDT = (n: number | string | null | undefined) =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(n))
</script>

<template>
  <UCard>
    <div v-if="unitLoading" class="text-sm text-gray-500">Loading unit info…</div>

    <div
      v-else-if="unitError"
      class="flex items-center justify-between gap-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded p-3"
    >
      <span class="text-sm">{{ unitError }}</span>
      <UButton size="xs" variant="soft" color="rose" @click="emit('retry')">Retry</UButton>
    </div>

    <div v-else-if="unitInfo" class="text-base text-gray-600">
      <div class="flex items-center gap-2">
        <div>
          <strong>Unit:</strong> {{ unitInfo.label }}
          <span class="text-gray-400">(#{{ unitInfo.id }})</span>
        </div>
        <UBadge
          :color="unitInfo.status === 'vacant' ? 'primary' : unitInfo.status === 'occupied' ? 'secondary' : unitInfo.status === 'maintenance' ? 'warning' : 'neutral'"
          variant="soft"
          class="capitalize"
        >
          {{ unitInfo.status || 'vacant' }}
        </UBadge>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
        <div><strong>Market Rent:</strong> {{ fmtBDT(unitInfo.market_rent) }}</div>
        <div><strong>Bedrooms:</strong> {{ unitInfo.bedrooms ?? '—' }}</div>
        <div><strong>Bathrooms:</strong> {{ unitInfo.bathrooms ?? '—' }}</div>
        <div><strong>Sq Ft:</strong> {{ unitInfo.sqft ?? '—' }}</div>
        <div><strong>Property:</strong> {{ unitInfo.property?.name ?? ('#' + unitInfo.property_id) }}</div>
        <div><strong>Portfolio:</strong> {{ unitInfo.portfolio?.name ?? ('#' + unitInfo.portfolio_id) }}</div>
      </div>
    </div>

    <div v-else class="text-sm text-amber-600">Unit context not loaded.</div>

    <div class="mt-6 flex justify-end gap-2">
      <UButton variant="soft" color="neutral" @click="emit('cancel')">Cancel</UButton>
      <UTooltip :text="canLeaseThisUnit ? '' : 'Only vacant units can be leased'" :content="{ side: 'top' }">
        <UButton :disabled="!canLeaseThisUnit" @click="emit('next')">Next</UButton>
      </UTooltip>
    </div>
  </UCard>
</template>
