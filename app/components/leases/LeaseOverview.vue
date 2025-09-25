<template>
  <UCard :ui="{ body: 'p-3 sm:p-4' }">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <h3 class="text-xs sm:text-sm font-medium mb-1.5">Dates</h3>
        <div class="text-xs sm:text-sm text-gray-600 space-y-0.5">
          Start: <span class="font-medium">{{ lease?.start_date }}</span><br>
          End: <span class="font-medium">{{ lease?.end_date || '—' }}</span>
        </div>
      </div>
      <div>
        <h3 class="text-xs sm:text-sm font-medium mb-1.5">Finance</h3>
        <div class="text-xs sm:text-sm text-gray-600 space-y-0.5">
          Rent: <span class="font-medium">{{ fmtBDT(lease?.rent) }}</span><br>
          Deposit: <span class="font-medium">{{ fmtBDT(lease?.deposit) }}</span><br>
          Billing Day: <span class="font-medium">{{ lease?.billing_day }}</span>
          · Grace: <span class="font-medium">{{ lease?.grace_days }}d</span>
        </div>
        <div class="mt-2 text-xs sm:text-sm">
          Balance: <UBadge color="primary" variant="soft">{{ balanceBDT }}</UBadge>
        </div>
      </div>

      <div class="sm:col-span-2">
        <h3 class="text-xs sm:text-sm font-medium mb-1.5">Tenants</h3>
        <div v-if="(lease?.lease_tenants || []).length === 0" class="text-xs sm:text-sm text-gray-500">No tenants linked.</div>
        <ul v-else class="space-y-2">
          <li v-for="t in lease.lease_tenants" :key="t.id" class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs sm:text-sm">
            <div class="font-medium">{{ t.tenant.first_name }} {{ t.tenant.last_name }}</div>
            <div v-if="t.tenant.phone || t.tenant.email" class="text-xs text-gray-500 mt-1 space-y-1">
              <div v-if="t.tenant.phone" class="flex items-center">
                <UIcon name="i-lucide-phone" class="w-3 h-3 mr-1.5 flex-shrink-0" />
                <a :href="'tel:' + t.tenant.phone" class="truncate hover:text-primary-600">{{ t.tenant.phone }}</a>
              </div>
              <div v-if="t.tenant.email" class="flex items-center">
                <UIcon name="i-lucide-mail" class="w-3 h-3 mr-1.5 flex-shrink-0" />
                <a :href="'mailto:' + t.tenant.email" class="truncate hover:text-primary-600">{{ t.tenant.email }}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="sm:col-span-2">
        <h3 class="text-xs sm:text-sm font-medium mb-1.5">Notes</h3>
        <p class="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">{{ lease?.notes || '—' }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  const props = defineProps<{ lease: any | null; balanceBDT: string; fmtBDT: (n:any)=>string }>()
</script>
