<script setup lang="ts">
import {
  safeParse,
  object, string, number,
  minValue, maxValue, nullable, pipe, minLength
} from 'valibot'

const props = defineProps<{
  unitInfo: any | null
  tenants: Array<{ id: number; first_name: string; last_name: string }>
  modelValue: {
    start_date: string
    end_date: string
    rent: number
    deposit: number
    billing_day: number
    grace_days: number
    late_fee_flat: number
    late_fee_percent: number
    notes: string
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue]
  back: []
  next: []
}>()

const details = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
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

function validateDetails() {
  // clear old errors
  Object.keys(detailErrors).forEach((k) => delete detailErrors[k])

  // cross-field
  if (details.value.start_date && details.value.end_date && new Date(details.value.start_date) >= new Date(details.value.end_date)) {
    detailErrors.end_date = 'End date must be after start date'
    return false
  }

  const result = safeParse(DetailsSchema, details.value as any)
  if (result.success) return true

  result.issues.forEach((issue: any) => {
    const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0]?.key : undefined
    if (path && typeof path === 'string') detailErrors[path] = issue.message
  })
  return false
}

const isValid = computed(() => {
  const d = details.value
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
  if (!details.value.start_date) return false
  const d = new Date(details.value.start_date)
  return d.getDate() !== (details.value.billing_day || 1)
})
const prorated = computed(() => prorationAmount(details.value.rent, details.value.start_date))

const fmtBDT = (n: number | string | null | undefined) =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(n))

function onNext() {
  if (!validateDetails()) {
    const firstKey = Object.keys(detailErrors).find(k => detailErrors[k])
    if (firstKey && process.client) {
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null
      el?.focus?.()
    }
    return
  }
  emit('next')
}
</script>

<template>
  <UCard>
    <!-- Read-only context -->
    <div class="mb-4 text-sm text-gray-600">
      <div>
        <strong>Unit:</strong> {{ unitInfo?.label }}
        <span class="text-gray-400">(#{{ unitInfo?.id }})</span>
        · Property: {{ unitInfo?.property?.name ?? ('#' + unitInfo?.property_id) }}
      </div>
      <div>
        <strong>Tenant(s):</strong>
        <template v-if="tenants.length">
          {{ tenants.map(t => t.first_name + ' ' + t.last_name).join(', ') }}
        </template>
        <template v-else>—</template>
      </div>
    </div>

    <UForm :state="details" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <strong>{{ fmtBDT(prorated) }}</strong>
        <span class="text-gray-500"> (auto-calculated based on start date)</span>
      </div>
      <div v-else class="text-gray-500">Starts on billing day — no proration.</div>
    </div>

    <div class="mt-6 flex justify-between">
      <UButton variant="soft" color="neutral" @click="emit('back')">Back</UButton>
      <UButton :disabled="!isValid" @click="onNext">Next</UButton>
    </div>
  </UCard>
</template>
