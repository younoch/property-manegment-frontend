<template>
  <UCard :ui="{ body: 'p-3 sm:p-4' }">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
      <div class="text-xs sm:text-sm text-gray-600">Payments for this lease</div>
      <UButton 
        icon="i-lucide-banknote" 
        size="sm"
        @click="$emit('open-payment')"
        class="w-full sm:w-auto justify-center"
      >
        <span class="hidden sm:inline">Record payment</span>
        <span class="sm:hidden">New Payment</span>
      </UButton>
    </div>

    <div v-if="items.length===0" class="text-xs sm:text-sm text-gray-500">No payments yet.</div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-xs sm:text-sm">
        <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
          <tr class="whitespace-nowrap">
            <th class="py-2 px-2 sm:px-3 text-left">#</th>
            <th class="py-2 px-1 sm:px-3 text-left">Method</th>
            <th class="py-2 px-1 sm:px-3 text-left">Date</th>
            <th class="py-2 px-1 sm:px-3 text-right">Amount</th>
            <th class="py-2 px-1 sm:px-3 text-left">Ref</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
          <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
            <td class="py-2 px-2 sm:px-3 font-medium">#{{ p.id }}</td>
            <td class="py-2 px-1 sm:px-3 capitalize">{{ (p.method || '').replace('_',' ') }}</td>
            <td class="py-2 px-1 sm:px-3 whitespace-nowrap">{{ fmtDate(p.at || p.created_at) }}</td>
            <td class="py-2 px-1 sm:px-3 text-right font-medium whitespace-nowrap">{{ fmtBDT(p.amount) }}</td>
            <td class="py-2 px-1 sm:px-3 max-w-[100px] truncate" :title="p.reference">{{ p.reference || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ items: any[]; fmtBDT: (n:any)=>string; fmtDate: (iso?:string)=>string }>()
defineEmits(['open-payment'])
</script>
