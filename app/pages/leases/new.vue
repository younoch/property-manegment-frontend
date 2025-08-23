<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

import { createProtectedApiClient } from '../../utils/api'
import { useAuth } from '../../composables/useAuth'
import { useDebounceFn } from '@vueuse/core'
import { useApiToast } from '../../composables/useApiToast'

// Valibot
import {
  safeParse,
  object,
  string,
  number,
  minValue,
  maxValue,
  nullable,
  pipe,
  minLength,
} from 'valibot'

/** ─────────────────────────────────────────────────────────
 * Setup & Query Prefill
 * ───────────────────────────────────────────────────────── */
const api = createProtectedApiClient()
const { checkAuth } = useAuth()
await checkAuth()

const route = useRoute()
const router = useRouter()
const { success: toastSuccess, error: toastError, info: toastInfo } = useApiToast()

const prefill = reactive({
  portfolioId: route.query.portfolioId ? Number(route.query.portfolioId) : undefined,
  propertyId: route.query.propertyId ? Number(route.query.propertyId) : undefined,
  unitId: route.query.unitId ? Number(route.query.unitId) : undefined
})

/** ─────────────────────────────────────────────────────────
 * Stepper State
 * ───────────────────────────────────────────────────────── */
const steps = [
  { label: 'Unit' },
  { label: 'Tenants' },
  { label: 'Details' },
  { label: 'Review' }
]
const activeStep = ref(0)

/** Helpers */
const fmtBDT = (n: number | string | null | undefined) =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0
      }).format(Number(n))

/** ─────────────────────────────────────────────────────────
 * Step 0: Unit (readonly if pre-selected)
 * ───────────────────────────────────────────────────────── */
const unitInfo = ref<any | null>(null)
const unitLoading = ref(false)
const unitError = ref<string | null>(null)

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
  } catch (e: any) {
    unitError.value = e?.message || 'Failed to load unit'
  } finally {
    unitLoading.value = false
  }
}
onMounted(loadUnitContext)

const canLeaseThisUnit = computed(() => unitInfo.value?.status === 'vacant')

/** ─────────────────────────────────────────────────────────
 * Step 1: Tenants (search/select + add inline)
 * ───────────────────────────────────────────────────────── */
type Tenant = { id: number; first_name: string; last_name: string; email?: string | null; phone?: string | null }

const tenantSearch = ref('')
const tenantsLoading = ref(false)
const tenantOptions = ref<Tenant[]>([])
const selectedTenants = ref<Tenant[]>([])

const searchTenants = useDebounceFn(async () => {
  if (!prefill.portfolioId) return
  tenantsLoading.value = true
  try {
    const search = tenantSearch.value ? `?search=${encodeURIComponent(tenantSearch.value)}&limit=20` : ''
    const res = await api.get<any>(`/portfolios/${prefill.portfolioId}/tenants${search}`)
    let list: any[] = []
    if (Array.isArray(res?.data)) list = res.data
    else if (Array.isArray(res?.data?.data)) list = res.data.data
    else if (res?.data) list = [res.data]
    tenantOptions.value = list
  } catch {
    toastError('Failed to load tenants')
  } finally {
    tenantsLoading.value = false
  }
}, 300)

watch(tenantSearch, () => searchTenants(), { immediate: true })

// minimal inline add
const newTenant = reactive({ first_name: '', last_name: '', email: '', phone: '' })
const addingTenant = ref(false)
async function addTenantInline() {
  if (!prefill.portfolioId) return
  if (!newTenant.first_name || !newTenant.last_name) return
  addingTenant.value = true
  try {
    const payload = {
      portfolio_id: prefill.portfolioId,
      first_name: newTenant.first_name,
      last_name: newTenant.last_name,
      email: newTenant.email || null,
      phone: newTenant.phone || null,
      is_active: true
    }
    const res = await api.post<any>(`/portfolios/${prefill.portfolioId}/tenants`, payload)
    const created = res?.data ?? res
    tenantOptions.value.unshift(created)
    selectedTenants.value.push(created)
    Object.assign(newTenant, { first_name: '', last_name: '', email: '', phone: '' })
    toastSuccess('Tenant added')
  } catch {
    toastError('Failed to add tenant')
  } finally {
    addingTenant.value = false
  }
}

/** ─────────────────────────────────────────────────────────
 * Step 2: Lease Details (with proration preview) + Validation
 * ───────────────────────────────────────────────────────── */
const details = reactive({
  start_date: '',
  end_date: '',
  rent: 0,
  deposit: 0,
  billing_day: 1,
  grace_days: 3,
  late_fee_flat: 0,
  late_fee_percent: 0,
  notes: ''
})

const detailErrors = reactive<Record<string, string | undefined>>({})

const DetailsSchema = object({
  start_date: pipe(string(), minLength(1, 'Start date is required')),
  end_date:   pipe(string(), minLength(1, 'End date is required')),
  rent:        pipe(number(), minValue(1, 'Rent must be greater than 0')),
  deposit:     pipe(number(), minValue(0, 'Deposit cannot be negative')),
  billing_day: pipe(number(), minValue(1, 'Billing day must be between 1-31'), maxValue(31, 'Billing day must be between 1-31')),
  grace_days:  pipe(number(), minValue(0, 'Grace days cannot be negative')),
  late_fee_flat:    pipe(number(), minValue(0, 'Late fee (flat) cannot be negative')),
  late_fee_percent: pipe(number(), minValue(0, 'Late fee (%) cannot be negative')),
  notes: nullable(string())
})


function validateDetails(state: typeof details) {
  // clear old errors first
  Object.keys(detailErrors).forEach((k) => delete detailErrors[k])

  // cross-field rule: start < end
  if (state.start_date && state.end_date && new Date(state.start_date) >= new Date(state.end_date)) {
    detailErrors.end_date = 'End date must be after start date'
    return [{ path: [{ key: 'end_date' }], message: detailErrors.end_date }]
  }

  const result = safeParse(DetailsSchema, state as any)
  if (result.success) return []

  result.issues.forEach((issue: any) => {
    const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0]?.key : undefined
    if (path && typeof path === 'string') detailErrors[path] = issue.message
  })
  return result.issues
}

/** Pure validity (for button disable only; no side effects) */
const isDetailsValid = computed(() => {
  const d = details
  if (!d.start_date || !d.end_date) return false
  if (new Date(d.start_date) >= new Date(d.end_date)) return false
  if (!(typeof d.rent === 'number') || d.rent <= 0) return false
  if (!(typeof d.deposit === 'number') || d.deposit < 0) return false
  if (!(typeof d.billing_day === 'number') || d.billing_day < 1 || d.billing_day > 31) return false
  if (!(typeof d.grace_days === 'number') || d.grace_days < 0) return false
  if (!(typeof d.late_fee_flat === 'number') || d.late_fee_flat < 0) return false
  if (!(typeof d.late_fee_percent === 'number') || d.late_fee_percent < 0) return false
  return true
})

/** Proration */
function prorationAmount(rent: number, startISO: string) {
  if (!rent || !startISO) return 0
  const start = new Date(startISO)
  if (Number.isNaN(start.getTime())) return 0
  const y = start.getFullYear(), m = start.getMonth()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const occupiedDays = Math.max(0, daysInMonth - start.getDate() + 1)
  return Math.round(rent * (occupiedDays / daysInMonth))
}
const showProration = computed(() => {
  if (!details.start_date) return false
  const d = new Date(details.start_date)
  return d.getDate() !== (details.billing_day || 1)
})
const prorated = computed(() => prorationAmount(details.rent, details.start_date))

/** ─────────────────────────────────────────────────────────
 * Step 3: Review & Activate
 * ───────────────────────────────────────────────────────── */
const createFirstInvoice = ref(true)
const createDepositInvoice = ref(true)

/** ─────────────────────────────────────────────────────────
 * Mutations: create draft → attach tenants → activate
 * ───────────────────────────────────────────────────────── */
const creating = ref(false)
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
    const payload = {
      unit_id: prefill.unitId,
      start_date: details.start_date,
      end_date: details.end_date,
      rent: details.rent,
      deposit: details.deposit,
      billing_day: details.billing_day,
      grace_days: details.grace_days,
      late_fee_flat: details.late_fee_flat,
      late_fee_percent: details.late_fee_percent,
      notes: details.notes
    }
    const res = await api.post<any>(`/portfolios/${prefill.portfolioId}/units/${prefill.unitId}/leases`, payload)
    const created = res?.data ?? res
    draftLeaseId.value = typeof created?.id === 'string' ? Number(created.id) : created?.id
    return draftLeaseId.value
  } finally {
    creating.value = false
  }
}

async function attachTenants(leaseId: number) {
  if (!selectedTenants.value.length) return
  const tenant_ids = selectedTenants.value.map(t => t.id)
  await api.post<any>(`/leases/${leaseId}/tenants`, { tenant_ids })
}

const activating = ref(false)
async function activateLease() {
  // Run full validation once before activating
  const issues = validateDetails(details)
  if (issues.length) {
    const firstKey = Object.keys(detailErrors).find(k => detailErrors[k])
    if (firstKey && process.client) {
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null
      el?.focus?.()
    }
    return
  }

  const leaseId = await createDraftLeaseIfNeeded()
  if (!leaseId) return
  await attachTenants(leaseId)

  activating.value = true
  try {
    await api.post<any>(`/leases/${leaseId}/activate`, {
      create_first_invoice: createFirstInvoice.value,
      create_deposit_invoice: createDepositInvoice.value
    })
    toastSuccess('Lease activated')
    router.push(`/leases/${leaseId}`)
  } catch (e: any) {
    toastError(e?.message || 'Activation failed')
  } finally {
    activating.value = false
  }
}

/** ─────────────────────────────────────────────────────────
 * Navigation actions (with vacancy re-check on Step 0 → Next)
 * ───────────────────────────────────────────────────────── */
async function next() {
  if (activeStep.value === 0) {
    await loadUnitContext()
    if (!canLeaseThisUnit.value) {
      toastInfo('This unit is not vacant anymore. Please pick another unit.')
      return
    }
    if (!canGoTenants()) return
  }

  if (activeStep.value === 1) {
    if (!canGoDetails()) {
      toastError('Please select at least one tenant')
      return
    }
  }

  if (activeStep.value === 2) {
    const issues = validateDetails(details) // mutate errors and block if any
    if (issues.length) {
      const firstKey = Object.keys(detailErrors).find(k => detailErrors[k])
      if (firstKey && process.client) {
        const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null
        el?.focus?.()
      }
      return
    }
  }

  activeStep.value = Math.min(activeStep.value + 1, steps.length - 1)
}
function back() {
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

    <!-- Stepper -->
    <UStepper :items="steps" v-model="activeStep" orientation="horizontal" />

    <!-- Step 0: Unit -->
    <UCard v-if="activeStep === 0">
      <div v-if="unitLoading" class="text-sm text-gray-500">Loading unit info…</div>

      <div
        v-else-if="unitError"
        class="flex items-center justify-between gap-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded p-3"
      >
        <span class="text-sm">{{ unitError }}</span>
        <UButton size="xs" variant="soft" color="rose" @click="loadUnitContext">Retry</UButton>
      </div>

      <div v-else-if="unitInfo" class="text-base text-gray-600">
        <div class="flex items-center gap-2">
          <div>
            <strong>Unit:</strong> {{ unitInfo.label }}
            <span class="text-gray-400">(#{{ unitInfo.id }})</span>
          </div>
          <UBadge
            :color="unitInfo.status === 'vacant' ? 'primary' : unitInfo.status === 'occupied' ? 'secondary' : unitInfo.status === 'maintenance' ? 'warning' : 'neutral'"
            variant="soft"
            class="capitalize"
          >
            {{ unitInfo.status || 'vacant' }}
          </UBadge>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          <div><strong>Market Rent:</strong> {{ fmtBDT(unitInfo.market_rent) }}</div>
          <div><strong>Bedrooms:</strong> {{ unitInfo.bedrooms ?? '—' }}</div>
          <div><strong>Bathrooms:</strong> {{ unitInfo.bathrooms ?? '—' }}</div>
          <div><strong>Sq Ft:</strong> {{ unitInfo.sqft ?? '—' }}</div>
          <div><strong>Property:</strong> {{ unitInfo.property?.name ?? ('#' + unitInfo.property_id) }}</div>
          <div><strong>Portfolio:</strong> {{ unitInfo.portfolio?.name ?? ('#' + unitInfo.portfolio_id) }}</div>
        </div>
      </div>

      <div v-else class="text-sm text-amber-600">Unit context not loaded.</div>

      <div class="mt-6 flex justify-end gap-2">
        <UButton variant="soft" color="neutral" @click="router.back()">Cancel</UButton>
        <UTooltip :text="canLeaseThisUnit ? '' : 'Only vacant units can be leased'" :content="{ side: 'top' }">
          <UButton :disabled="!canGoTenants()" @click="next">Next</UButton>
        </UTooltip>
      </div>
    </UCard>

    <!-- Step 1: Tenants -->
    <UCard v-else-if="activeStep === 1">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Search existing -->
        <div class="lg:col-span-2 space-y-3">
          <UFormField label="Search Tenants (name, email, phone)">
            <UInput v-model="tenantSearch" placeholder="Type to search…" />
          </UFormField>

          <div class="rounded border border-gray-200 dark:border-white/10 p-2 min-h-24">
            <div v-if="tenantsLoading" class="text-sm text-gray-500 p-2">Searching…</div>
            <template v-else>
              <div v-if="tenantOptions.length === 0" class="text-sm text-gray-500 p-2">No tenants found.</div>
              <ul v-else class="divide-y divide-gray-100 dark:divide-white/10">
                <li v-for="t in tenantOptions" :key="t.id" class="flex items-center justify-between py-2">
                  <div class="text-sm">
                    <div class="font-medium">{{ t.first_name }} {{ t.last_name }}</div>
                    <div class="text-gray-500">
                      <span v-if="t.email">{{ t.email }}</span>
                      <span v-if="t.phone" class="ml-2">· {{ t.phone }}</span>
                    </div>
                  </div>
                  <UButton
                    size="xs"
                    variant="soft"
                    :disabled="selectedTenants.some(s => s.id === t.id)"
                    @click="selectedTenants.push(t)"
                  >
                    Select
                  </UButton>
                </li>
              </ul>
            </template>
          </div>
        </div>

        <!-- Add new inline -->
        <div class="space-y-3">
          <div class="text-sm font-medium">Add New Tenant</div>
          <UFormField label="First Name"><UInput v-model="newTenant.first_name" /></UFormField>
          <UFormField label="Last Name"><UInput v-model="newTenant.last_name" /></UFormField>
          <UFormField label="Email (optional)"><UInput v-model="newTenant.email" /></UFormField>
          <UFormField label="Phone (optional)"><UInput v-model="newTenant.phone" /></UFormField>
          <UButton :loading="addingTenant" @click="addTenantInline">Add & Select</UButton>
        </div>
      </div>

      <!-- Selected tenants -->
      <div class="mt-6">
        <div class="text-sm font-medium mb-2">Selected Tenant(s)</div>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="t in selectedTenants" :key="t.id" variant="soft">
            {{ t.first_name }} {{ t.last_name }}
            <UButton
              size="2xs"
              variant="ghost"
              class="ml-2"
              @click="selectedTenants = selectedTenants.filter(s => s.id !== t.id)"
            >
              Remove
            </UButton>
          </UBadge>
        </div>
      </div>

      <div class="mt-6 flex justify-between">
        <UButton variant="soft" color="neutral" @click="back">Back</UButton>
        <UButton :disabled="!canGoDetails()" @click="next">Next</UButton>
      </div>
    </UCard>

    <!-- Step 2: Details -->
    <UCard v-else-if="activeStep === 2">
      <!-- Read-only context (unit + tenants selected) -->
      <div class="mb-4 text-sm text-gray-600">
        <div>
          <strong>Unit:</strong> {{ unitInfo?.label }}
          <span class="text-gray-400">(#{{ unitInfo?.id }})</span>
          · Property: {{ unitInfo?.property?.name ?? ('#' + unitInfo?.property_id) }}
        </div>
        <div>
          <strong>Tenant(s):</strong>
          <template v-if="selectedTenants.length">
            {{ selectedTenants.map(t => t.first_name + ' ' + t.last_name).join(', ') }}
          </template>
          <template v-else>—</template>
        </div>
      </div>

      <!-- Validated form -->
      <UForm :state="details" :validate="validateDetails" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormField label="Start Date" name="start_date" :error="detailErrors.start_date">
          <UInput v-model="details.start_date" type="date" />
        </UFormField>

        <UFormField label="End Date" name="end_date" :error="detailErrors.end_date">
          <UInput v-model="details.end_date" type="date" />
        </UFormField>

        <UFormField label="Monthly Rent (BDT)" name="rent" :error="detailErrors.rent">
          <UInput v-model.number="details.rent" type="number" min="0" step="1" />
        </UFormField>

        <UFormField label="Security Deposit (BDT)" name="deposit" :error="detailErrors.deposit">
          <UInput v-model.number="details.deposit" type="number" min="0" step="1" />
        </UFormField>

        <UFormField label="Billing Day (1–31)" name="billing_day" :error="detailErrors.billing_day">
          <UInput v-model.number="details.billing_day" type="number" min="1" max="31" step="1" />
        </UFormField>

        <UFormField label="Grace Days" name="grace_days" :error="detailErrors.grace_days">
          <UInput v-model.number="details.grace_days" type="number" min="0" step="1" />
        </UFormField>

        <UFormField label="Late Fee Flat (BDT)" name="late_fee_flat" :error="detailErrors.late_fee_flat">
          <UInput v-model.number="details.late_fee_flat" type="number" min="0" step="1" />
        </UFormField>

        <UFormField label="Late Fee Percent (%)" name="late_fee_percent" :error="detailErrors.late_fee_percent">
          <UInput v-model.number="details.late_fee_percent" type="number" min="0" step="0.5" />
        </UFormField>

        <UFormField class="sm:col-span-2" label="Notes" name="notes" :error="detailErrors.notes">
          <UTextarea v-model="details.notes" placeholder="Optional notes or special terms" />
        </UFormField>
      </UForm>

      <div class="mt-4 text-sm">
        <div class="font-medium">Proration</div>
        <div v-if="showProration">
          First-month prorated rent estimate:
          <strong>{{ new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(prorated) }}</strong>
          <span class="text-gray-500"> (auto-calculated based on start date)</span>
        </div>
        <div v-else class="text-gray-500">Starts on billing day — no proration.</div>
      </div>

      <div class="mt-6 flex justify-between">
        <UButton variant="soft" color="neutral" @click="back">Back</UButton>
        <UButton :disabled="!isDetailsValid" @click="next">Next</UButton>
      </div>
    </UCard>

    <!-- Step 3: Review & Activate -->
    <UCard v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div class="text-sm font-medium">Unit</div>
          <div class="text-sm text-gray-600">
            Portfolio #{{ prefill.portfolioId }} · Property #{{ prefill.propertyId }} · Unit #{{ prefill.unitId }}
          </div>
          <div v-if="unitInfo" class="text-sm text-gray-600 mt-1">
            Label: {{ unitInfo.label }} · Market Rent: {{ fmtBDT(unitInfo.market_rent) }}
          </div>
        </div>

        <div>
          <div class="text-sm font-medium">Tenants</div>
          <ul class="text-sm text-gray-600 list-disc list-inside">
            <li v-for="t in selectedTenants" :key="t.id">
              {{ t.first_name }} {{ t.last_name }} <span v-if="t.phone">· {{ t.phone }}</span>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-sm font-medium">Dates</div>
          <div class="text-sm text-gray-600">{{ details.start_date }} → {{ details.end_date }}</div>
        </div>

        <div>
          <div class="text-sm font-medium">Finance</div>
          <div class="text-sm text-gray-600">
            Rent: {{ fmtBDT(details.rent) }} | Deposit: {{ fmtBDT(details.deposit) }}
          </div>
          <div v-if="showProration" class="text-xs text-gray-500">
            First-month proration: ~{{ fmtBDT(prorated) }}
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-center gap-4">
        <USwitch v-model="createFirstInvoice" /> <span class="text-sm">Create first rent invoice now</span>
        <USwitch v-model="createDepositInvoice" :disabled="!details.deposit || details.deposit <= 0" />
        <span class="text-sm" :class="!details.deposit || details.deposit <= 0 ? 'text-gray-400' : ''">
          Create deposit invoice now
        </span>
      </div>

      <div class="mt-6 flex justify-between">
        <UButton variant="soft" color="neutral" @click="back">Back</UButton>
        <div class="flex gap-2">
          <UButton variant="soft" color="neutral" @click="router.back()">Cancel</UButton>
          <UButton :loading="activating" icon="i-lucide-file-signature" color="primary" @click="activateLease">
            Activate Lease
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
