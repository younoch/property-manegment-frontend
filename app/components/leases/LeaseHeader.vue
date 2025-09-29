<template>
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-3">
        <h1 class="text-xl md:text-2xl font-semibold">Lease #{{ leaseId }}</h1>
        <UBadge :color="statusColor" variant="soft" class="capitalize">
          {{ lease?.status || 'draft' }}
        </UBadge>
      </div>
      <p class="text-sm text-gray-500 mt-1">
        Unit: <span class="font-medium">{{ lease?.unit?.label ?? ('#' + lease?.unit_id) }}</span>
        · Property: <span class="font-medium">{{ lease?.property?.name ?? ('#' + lease?.property_id) }}</span>
        · Portfolio: <span class="font-medium">#{{ lease?.portfolio?.name ?? ('#' + lease?.portfolio_id) }}</span>
      </p>
    </div>
    <div class="flex items-center gap-2">
      <UButton variant="ghost" @click="goBack" icon="i-heroicons-arrow-left">Back</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLeaseStatusColor } from '@/constants/leases'

const router = useRouter()
const props = defineProps<{ leaseId: number; lease: any | null }>()
const statusColor = computed(() => getLeaseStatusColor(props.lease?.status))

const goBack = () => {
  router.go(-1)
}
</script>
