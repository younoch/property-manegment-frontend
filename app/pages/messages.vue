<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6">
    <h1 class="text-2xl font-semibold mb-4">Messages</h1>
    <UCard>
      <div class="space-y-3">
        <div v-for="message in messages" :key="message.id" class="flex items-start justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50">
          <div class="flex items-start gap-3">
            <UIcon :name="message.read ? 'i-heroicons-envelope-open' : 'i-heroicons-envelope'" class="mt-0.5 w-5 h-5 text-gray-500" />
            <div>
              <p class="font-medium text-gray-900">{{ message.subject }}</p>
              <p class="text-sm text-gray-600">From: {{ message.from }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(message.date) }}</p>
            </div>
          </div>
          <UBadge :color="message.read ? 'gray' : 'primary'">{{ message.read ? 'Read' : 'Unread' }}</UBadge>
        </div>
      </div>
    </UCard>
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const messages = ref([
  { id: 1, from: 'John (Tenant)', subject: 'Leaky faucet in Apt 2B', date: '2025-07-01T10:30:00Z', read: false },
  { id: 2, from: 'Mary (Manager)', subject: 'Monthly report ready', date: '2025-06-28T14:05:00Z', read: true },
  { id: 3, from: 'Stripe', subject: 'Payment received - Invoice #1234', date: '2025-06-25T09:12:00Z', read: true }
])

const formatDate = (iso: string) => new Date(iso).toLocaleString()
</script>



