<template>
  <UCard>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h3 class="text-sm font-medium mb-2">Dates</h3>
        <div class="text-sm text-gray-600">
          Start: <span class="font-medium">{{ lease?.start_date }}</span><br>
          End: <span class="font-medium">{{ lease?.end_date || '—' }}</span>
        </div>
      </div>
      <div>
        <h3 class="text-sm font-medium mb-2">Finance</h3>
        <div class="text-sm text-gray-600">
          Rent: <span class="font-medium">{{ fmtBDT(lease?.rent) }}</span><br>
          Deposit: <span class="font-medium">{{ fmtBDT(lease?.deposit) }}</span><br>
          Billing Day: <span class="font-medium">{{ lease?.billing_day }}</span>
          · Grace: <span class="font-medium">{{ lease?.grace_days }}d</span>
        </div>
        <div class="mt-3 text-sm">
          Balance: <UBadge color="primary" variant="soft">{{ balanceBDT }}</UBadge>
        </div>
      </div>

      <div class="sm:col-span-2">
        <h3 class="text-sm font-medium mb-2">Tenants</h3>
        <div v-if="(lease?.lease_tenants || []).length === 0" class="text-sm text-gray-500">No tenants linked.</div>
        <ul v-else class="text-sm text-gray-700 list-disc list-inside">
          <li v-for="t in lease.lease_tenants" :key="t.id">
            {{ t.tenant.first_name }} {{ t.tenant.last_name }}
            <span v-if="t.tenant.phone" class="text-gray-500">· {{ t.tenant.phone }}</span>
            <span v-if="t.tenant.email" class="text-gray-500">· {{ t.tenant.email }}</span>
          </li>
        </ul>
      </div>

      <div class="sm:col-span-2">
        <h3 class="text-sm font-medium mb-2">Notes</h3>
        <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ lease?.notes || '—' }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  const props = defineProps<{ lease: any | null; balanceBDT: string; fmtBDT: (n:any)=>string }>()
</script>
