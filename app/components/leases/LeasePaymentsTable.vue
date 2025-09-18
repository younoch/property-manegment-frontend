<template>
  <UCard>
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm text-gray-600">Payments for this lease</div>
      <UButton icon="i-lucide-banknote" @click="$emit('open-payment')">Record payment</UButton>
    </div>

    <div v-if="items.length===0" class="text-sm text-gray-500">No payments yet.</div>
    <div v-else class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
      <table class="w-full text-sm">
        <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
          <tr>
            <th class="py-2 px-3 text-left">Payment</th>
            <th class="py-2 px-3 text-left">Method</th>
            <th class="py-2 px-3 text-left">Date</th>
            <th class="py-2 px-3 text-right">Amount</th>
            <th class="py-2 px-3 text-left">Reference</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
          <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
            <td class="py-2 px-3 font-medium">#{{ p.id }}</td>
            <td class="py-2 px-3 capitalize">{{ (p.method || '').replace('_',' ') }}</td>
            <td class="py-2 px-3">{{ fmtDate(p.at || p.created_at) }}</td>
            <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(p.amount) }}</td>
            <td class="py-2 px-3">{{ p.reference || '—' }}</td>
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
