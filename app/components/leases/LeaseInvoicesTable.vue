<template>
  <UCard :ui="{ body: 'p-3 sm:p-4' }">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
      <div class="text-xs sm:text-sm text-gray-600 space-x-1.5">
        <span>Open: <span class="font-medium">{{ totals.open }}</span></span>
        <span class="hidden sm:inline">·</span>
        <span>Overdue: <span class="font-medium text-amber-600">{{ totals.overdue }}</span></span>
        <span class="hidden sm:inline">·</span>
        <span>Paid: <span class="font-medium text-primary-600">{{ totals.paid }}</span></span>
      </div>
      <UButton 
        icon="i-lucide-file-plus" 
        size="sm"
        :loading="generating" 
        @click="$emit('generate-next')"
        class="w-full sm:w-auto justify-center"
      >
        <span class="hidden sm:inline">Generate next invoice</span>
        <span class="sm:hidden">New Invoice</span>
      </UButton>
    </div>

    <div v-if="items.length===0" class="text-xs sm:text-sm text-gray-500">No invoices yet.</div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-xs sm:text-sm">
        <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
          <tr class="whitespace-nowrap">
            <th class="py-2 px-2 sm:px-3 text-left">#</th>
            <th class="py-2 px-1 sm:px-3 text-left">Issue</th>
            <th class="py-2 px-1 sm:px-3 text-left">Due</th>
            <th class="py-2 px-1 sm:px-3 text-right">Total</th>
            <th class="py-2 px-1 sm:px-3 text-left">Status</th>
            <th class="py-2 px-2 sm:px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
          <tr v-for="inv in items" :key="inv.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
            <td class="py-2 px-2 sm:px-3 font-medium">
              <ULink :to="`/invoices/${inv.id}`" class="text-primary-600 hover:underline">#{{ inv.id }}</ULink>
            </td>
            <td class="py-2 px-1 sm:px-3 whitespace-nowrap">{{ fmtDate(inv.issue_date) }}</td>
            <td class="py-2 px-1 sm:px-3 whitespace-nowrap">{{ fmtDate(inv.due_date) }}</td>
            <td class="py-2 px-1 sm:px-3 text-right font-medium whitespace-nowrap">{{ fmtBDT(inv.total ?? inv.amount) }}</td>
            <td class="py-2 px-1 sm:px-3">
              <UBadge 
                :color="inv.status==='paid' ? 'primary' : inv.status==='overdue' ? 'amber' : inv.status==='void' ? 'gray' : 'neutral'" 
                variant="soft" 
                size="xs"
                class="capitalize"
              >
                {{ (inv.status || 'open').slice(0, 1).toUpperCase() + (inv.status || 'open').slice(1) }}
              </UBadge>
            </td>
            <td class="py-2 px-2 sm:px-3 text-right">
              <UButton 
                size="2xs" 
                variant="soft" 
                icon="i-lucide-banknote" 
                :disabled="inv.status==='paid' || inv.status==='void'" 
                @click="$emit('pay-clicked', inv)"
                class="min-w-[60px] sm:min-w-auto"
              >
                <span class="hidden sm:inline">Pay</span>
                <span class="sm:hidden">$</span>
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  items: any[];
  totals: { open: number; overdue: number; paid: number };
  generating: boolean;
  fmtBDT: (n:any)=>string;
  fmtDate: (iso?: string)=>string;
}>()
defineEmits(['generate-next','pay-clicked'])
</script>
