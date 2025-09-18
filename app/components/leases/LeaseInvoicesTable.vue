<template>
  <UCard>
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm text-gray-600">
        Open: <span class="font-medium">{{ totals.open }}</span> ·
        Overdue: <span class="font-medium text-amber-600">{{ totals.overdue }}</span> ·
        Paid: <span class="font-medium text-primary-600">{{ totals.paid }}</span>
      </div>
      <UButton icon="i-lucide-file-plus" :loading="generating" @click="$emit('generate-next')">Generate next invoice</UButton>
    </div>

    <div v-if="items.length===0" class="text-sm text-gray-500">No invoices yet.</div>
    <div v-else class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
      <table class="w-full text-sm">
        <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
          <tr>
            <th class="py-2 px-3 text-left">SL</th>
            <th class="py-2 px-3 text-left">Issue Date</th>
            <th class="py-2 px-3 text-left">Due Date</th>
            <th class="py-2 px-3 text-right">Total</th>
            <th class="py-2 px-3 text-left">Status</th>
            <th class="py-2 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
          <tr v-for="inv in items" :key="inv.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
            <td class="py-2 px-3 font-medium">
              <ULink :to="`/invoices/${inv.id}`" class="text-primary-600 hover:underline">#{{ inv.id }}</ULink>
            </td>
            <td class="py-2 px-3">{{ fmtDate(inv.issue_date) }}</td>
            <td class="py-2 px-3">{{ fmtDate(inv.due_date) }}</td>
            <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(inv.total ?? inv.amount) }}</td>
            <td class="py-2 px-3">
              <UBadge :color="inv.status==='paid' ? 'primary' : inv.status==='overdue' ? 'warning' : inv.status==='void' ? 'gray' : 'neutral'" variant="soft" class="capitalize">
                {{ inv.status || 'open' }}
              </UBadge>
            </td>
            <td class="py-2 px-3 text-right">
              <UButton size="xs" variant="soft" icon="i-lucide-banknote" :disabled="inv.status==='paid' || inv.status==='void'" @click="$emit('pay-clicked', inv)">
                Pay
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
