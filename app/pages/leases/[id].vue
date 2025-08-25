<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
    <LeaseHeader :leaseId="leaseId" :lease="lease" />

    <LeaseActions
      :lease="lease"
      :loading="loading"
      :generating-invoice="generatingInvoice"
      :activating="activating"
      @open-activate="openActivate = true"
      @open-end="openEnd = true"
      @generate-next="onGenerateNext"
      @refresh="reload"
      @open-payment="openPayment = true"
    />

    <UTabs v-model="tab" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      <template #overview>
        <LeaseOverview :lease="lease" :balanceBDT="balanceBDT" :fmtBDT="fmtBDT" />
      </template>

      <template #invoices>
        <LeaseInvoicesTable
          :items="invoices"
          :totals="invoiceTotals"
          :generating="generatingInvoice"
          :fmtBDT="fmtBDT"
          :fmtDate="fmtDate"
          @generate-next="onGenerateNext"
          @pay-clicked="openPayment = true"
        />
      </template>

      <template #payments>
        <LeasePaymentsTable
          :items="payments"
          :fmtBDT="fmtBDT"
          :fmtDate="fmtDate"
          @open-payment="openPayment = true"
        />
      </template>

      <template #tenants>
        <UCard>
          <div class="text-sm text-gray-500" v-if="(lease?.leaseTenants || []).length === 0">No tenants linked.</div>
          <ul v-else class="text-sm text-gray-700 list-disc list-inside">
            <li v-for="t in lease.leaseTenants" :key="t.id">
              {{ t.tenant.first_name }} {{ t.tenant.last_name }}
              <span v-if="t.tenant.phone" class="text-gray-500">· {{ t.tenant.phone }}</span>
              <span v-if="t.tenant.email" class="text-gray-500">· {{ t.tenant.email }}</span>
            </li>
          </ul>
        </UCard>
      </template>

      <template #documents>
        <UCard><div class="text-sm text-gray-500">No documents yet.</div></UCard>
      </template>
    </UTabs>

    <!-- Modals -->
    <ActivateLeaseModal
      v-model:open="openActivate"
      :loading="activating"
      :create-first-invoice="createFirstInvoice"
      :create-deposit-invoice="createDepositInvoice"
      :allow-deposit="Number(lease?.deposit || 0) > 0"
      @update:createFirstInvoice="v => createFirstInvoice = v"
      @update:createDepositInvoice="v => createDepositInvoice = v"
      @confirm="doActivate"
    />
    <EndLeaseModal v-model:open="openEnd" :loading="ending" @confirm="doEndLease" />

    <RecordPaymentModal
      v-model:open="openPayment"
      :loading="submittingPayment"
      @submit="submitPayment"
    />
  </div>
</template>

<script setup lang="ts">
import LeaseHeader from '@/components/leases/LeaseHeader.vue'
import LeaseActions from '@/components/leases/LeaseActions.vue'
import LeaseOverview from '@/components/leases/LeaseOverview.vue'
import LeaseInvoicesTable from '@/components/leases/LeaseInvoicesTable.vue'
import LeasePaymentsTable from '@/components/leases/LeasePaymentsTable.vue'
import RecordPaymentModal from '@/components/leases/modals/RecordPaymentModal.vue'
import ActivateLeaseModal from '@/components/leases/modals/ActivateLeaseModal.vue'
import EndLeaseModal from '@/components/leases/modals/EndLeaseModal.vue'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const leaseId = Number(route.params.id)

const {
  // state
  lease, invoices, payments,
  loading, generatingInvoice, activating, ending, submittingPayment,
  // toggles
  createFirstInvoice, createDepositInvoice,
  // utils
  invoiceTotals, balanceBDT, fmtBDT, fmtDate,
  // actions
  reload, doActivate, doEndLease, generateNextInvoice, submitPayment
} = useLeaseDetail(leaseId)

// ui
const tab = ref<'overview'|'invoices'|'payments'|'tenants'|'documents'>('overview')
const tabs = [
  { label:'Overview',  icon:'i-lucide-layout-dashboard', value:'overview',  slot:'overview'  as const },
  { label:'Invoices',  icon:'i-lucide-receipt',          value:'invoices',  slot:'invoices'  as const },
  { label:'Payments',  icon:'i-lucide-banknote',         value:'payments',  slot:'payments'  as const },
  { label:'Tenants',   icon:'i-lucide-users',            value:'tenants',   slot:'tenants'   as const },
  { label:'Documents', icon:'i-lucide-file',             value:'documents', slot:'documents' as const },
] satisfies import('@nuxt/ui').TabsItem[]

const openActivate = ref(false)
const openEnd = ref(false)
const openPayment = ref(false)

onMounted(reload)

async function onGenerateNext() {
  const created = await generateNextInvoice()
  if (created?.id) {
    navigateTo(`/invoices/${created.id}`)
  } else {
    await reload()
    tab.value = 'invoices'
  }
}
</script>
