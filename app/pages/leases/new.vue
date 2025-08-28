<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { createProtectedApiClient } from '../../utils/api'
import { useAuth } from '../../composables/useAuth'
import { useApiToast } from '../../composables/useApiToast'


// Step components
import StepUnit from '@/components/leases/StepUnit.vue'
import StepTenants from '~/components/leases/StepTenants.vue'
import StepDetails from '@/components/leases/StepDetails.vue'
import StepReview from '@/components/leases/StepReview.vue'

const api = createProtectedApiClient()
const { checkAuth } = useAuth()
await checkAuth()

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { success: toastSuccess, error: toastError, info: toastInfo } = useApiToast()

const prefill = reactive({
  portfolioId: route.query.portfolioId ? Number(route.query.portfolioId) : undefined,
  propertyId:  route.query.propertyId  ? Number(route.query.propertyId)  : undefined,
  unitId:      route.query.unitId      ? Number(route.query.unitId)      : undefined
})

/** Stepper */
const steps = [
  { label: 'Unit' },
  { label: 'Tenants' },
  { label: 'Details' },
  { label: 'Review' }
]
const activeStep = ref(0)

/** Unit context */
const unitInfo = ref<any | null>(null)
const unitLoading = ref(false)
const unitError = ref<string | null>(null)

/** Details */
const details = reactive({
  start_date: '',
  end_date: '',
  rent: 0,
  deposit: 0,
  billing_day: 1,
  grace_days: 3,
  late_fee_flat: 0,
  late_fee_percent: 0,
  notes: '',
  market_rent: null,
  timezone: ''
})

function updateDetails(newDetails: any) {
  // Only update the fields we expect in the details object
  const expectedFields = [
    'start_date', 'end_date', 'rent', 'deposit', 'billing_day',
    'grace_days', 'late_fee_flat', 'late_fee_percent', 'notes'
  ]
  
  // Create a clean object with only the expected fields
  const cleanDetails: Record<string, any> = {}
  expectedFields.forEach(field => {
    if (field in newDetails) {
      cleanDetails[field] = newDetails[field]
    }
  })
  
  // Apply the cleaned details
  Object.assign(details, cleanDetails)
}

async function loadUnitContext() {
  unitInfo.value = null
  unitError.value = null
  if (!prefill.portfolioId || !prefill.propertyId || !prefill.unitId) return
  unitLoading.value = true
  try {
    const res = await api.get<any>(`/units/${prefill.unitId}`)
    const raw = res?.data?.data ?? res?.data ?? res
    unitInfo.value = {
      ...raw,
      bathrooms: raw?.bathrooms != null ? Number(raw.bathrooms) : null,
      market_rent: raw?.market_rent != null ? Number(raw.market_rent) : null
    }
    details.rent = unitInfo.value.market_rent || 0
    details.deposit = unitInfo.value.market_rent || 0
  } catch (e: any) {
    unitError.value = e?.message || 'Failed to load unit'
  } finally {
    unitLoading.value = false
  }
}
onMounted(loadUnitContext)

const canLeaseThisUnit = computed(() => unitInfo.value?.status === 'vacant')

/** Tenants */
type Tenant = { id: number; first_name: string; last_name: string; email?: string | null; phone?: string | null }
const selectedTenants = ref<Tenant[]>([])

/** Draft + activate */
const creating = ref(false)
const activating = ref(false)
const draftLeaseId = ref<number | null>(null)

function canGoTenants() {
  return !!prefill.portfolioId && !!prefill.propertyId && !!prefill.unitId && canLeaseThisUnit.value
}
function canGoDetails() {
  return selectedTenants.value.length >= 1
}

async function createDraftLeaseIfNeeded() {
  if (draftLeaseId.value) return draftLeaseId.value
  creating.value = true
  try {
    // Create a copy of details to avoid reactivity issues
    const leaseDetails = { ...details }
    
    // Format payload according to API expectations
    const payload: Record<string, any> = {
      start_date: leaseDetails.start_date,
      end_date: leaseDetails.end_date,
      rent: Number(leaseDetails.rent) || 0,
      deposit: Number(leaseDetails.deposit) || 0,
      billing_day: Number(leaseDetails.billing_day) || 1,
      grace_days: Number(leaseDetails.grace_days) || 0,
      late_fee_flat: Number(leaseDetails.late_fee_flat) || 0,
      late_fee_percent: Number(leaseDetails.late_fee_percent) || 0,
      notes: leaseDetails.notes || ''
    }
    
    // Remove any null/undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key]
      }
    })
    
    console.log('Creating lease with payload:', payload)
    const res = await api.post<any>(`/portfolios/${prefill.portfolioId}/units/${prefill.unitId}/leases`, payload)
    const created = res?.data?.data ?? res?.data ?? res
    draftLeaseId.value = typeof created?.id === 'string' ? Number(created.id) : created?.id
    return draftLeaseId.value
  } catch (error) {
    console.error('Error creating lease:', error)
    throw error
  } finally {
    creating.value = false
  }
}

async function attachTenants(leaseId: number) {
  if (!selectedTenants.value.length) return
  const tenant_ids = selectedTenants.value.map(t => t.id)
  await api.post<any>(`/leases/${leaseId}/tenants`, { tenant_ids })
}

async function activateLease(opts: { createFirstInvoice: boolean; createDepositInvoice: boolean }) {
  // (Details validation happens inside StepDetails; here we do server calls)
  const leaseId = await createDraftLeaseIfNeeded()
  if (!leaseId) return
  await attachTenants(leaseId)

  activating.value = true
  try {
    await api.post<any>(`/leases/${leaseId}/activate`, {
      create_first_invoice: opts.createFirstInvoice,
      create_deposit_invoice: opts.createDepositInvoice
    })
    toastSuccess('Lease activated')
    router.push(`/leases/${leaseId}`)
  } catch (e: any) {
    toastError(e?.message || 'Activation failed')
  } finally {
    activating.value = false
  }
}

/** Navigation */
async function goNext() {
  if (activeStep.value === 0) {
    await loadUnitContext()
    if (!canLeaseThisUnit.value) {
      toast.add({ title: 'Unit not vacant', description: 'This unit is no longer vacant. Please pick another.', color: 'warning' })
      return
    }
    if (!canGoTenants()) return
  }
  if (activeStep.value === 1 && !canGoDetails()) {
    toast.add({ title: 'Select tenants', description: 'Pick at least one tenant to continue.', color: 'error' })
    return
  }
  activeStep.value = Math.min(activeStep.value + 1, steps.length - 1)
}
function goBack() {
  activeStep.value = Math.max(activeStep.value - 1, 0)
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">New Lease</h1>
        <p class="text-sm text-gray-500">Follow the steps to lease a unit to tenant(s).</p>
      </div>
      <UButton variant="ghost" to="/leases" icon="i-heroicons-arrow-left">Back to Leases</UButton>
    </div>

    <UStepper :items="steps" v-model="activeStep" orientation="horizontal" />

    <StepUnit
      v-if="activeStep === 0"
      :unit-info="unitInfo"
      :unit-loading="unitLoading"
      :unit-error="unitError"
      :can-lease-this-unit="canLeaseThisUnit"
      @retry="loadUnitContext"
      @cancel="() => router.back()"
      @next="goNext"
    />

    <!-- Step 1 -->
    <StepTenants
      v-else-if="activeStep === 1"
      :portfolio-id="prefill.portfolioId"
      v-model="selectedTenants"
      @back="goBack"
      @next="goNext"
    />

    <!-- Step 2 -->
    <StepDetails
      v-else-if="activeStep === 2"
      :unit-info="unitInfo"
      :tenants="selectedTenants"
      :model-value="details"
      @update:modelValue="updateDetails"
      @back="goBack"
      @next="goNext"
    />

    <!-- Step 3 -->
    <StepReview
      v-else
      :prefill="prefill"
      :unit-info="unitInfo"
      :tenants="selectedTenants"
      :details="details"
      :loading="activating"
      @back="goBack"
      @cancel="() => router.back()"
      @activate="activateLease"
    />
  </div>
</template>
