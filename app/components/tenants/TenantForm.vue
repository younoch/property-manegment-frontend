<template>
  <UModal 
    v-model:open="isOpen"
    :title="props.view ? 'View Tenant' : (model ? 'Edit Tenant' : 'Add Tenant')"
    :ui="{ content: 'w-full sm:max-w-4xl', header: 'p-2 sm:p-4 min-h-14', body: 'p-2 sm:p-4 ', width: 'w-full sm:max-w-4xl' }"
    :close="{ color: 'error', variant: 'outline', class: 'rounded-full' }"
  >
    <template #body>
      <div class="h-fit">
        <UForm :state="form" :validate="validate" @submit="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Portfolio" name="portfolio_id" :error="errors.portfolio_id" class="sm:col-span-2">
              <USelect
                v-model.string="form.portfolio_id"
                :items="portfolioOptions"
                placeholder="Select Portfolio"
                :disabled="true"
                class="w-full"
              />
            </UFormField>

            <UFormField label="First Name" name="first_name" :error="errors.first_name" required>
              <UInput v-model="form.first_name" placeholder="Enter first name" :disabled="props.view" class="w-full" />
            </UFormField>

            <UFormField label="Last Name" name="last_name" :error="errors.last_name" required>
              <UInput v-model="form.last_name" placeholder="Enter last name" :disabled="props.view" class="w-full" />
            </UFormField>

            <UFormField label="Email" name="email" :error="errors.email" required>
              <UInput v-model="form.email" type="email" placeholder="Enter email address" :disabled="props.view" class="w-full" />
            </UFormField>

            <UFormField label="Phone" name="phone" :error="errors.phone">
              <UInput v-model="form.phone" placeholder="Enter phone number" :disabled="props.view" class="w-full" />
            </UFormField>

            <UFormField label="Active Status" name="is_active" :error="errors.is_active" class="sm:col-span-2">
              <UToggle v-model="form.is_active" :disabled="props.view" />
            </UFormField>
          </div>

          <div class="flex items-center justify-end gap-2 mt-6">
            <UButton color="gray" variant="soft" @click.prevent="closeModal">{{ props.view ? 'Close' : 'Cancel' }}</UButton>
            <UButton v-if="!props.view" type="submit" :loading="pending">{{ model ? 'Update' : 'Create' }}</UButton>
            <UButton v-if="model && !props.view" color="red" variant="soft" @click.prevent="onDelete">Delete</UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { object, string, boolean, minLength, email, pipe, number, safeParse } from 'valibot'
import { createProtectedApiClient } from '../../utils/api'
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps<{
  open: boolean
  model?: any | null
  portfolioId?: string
  portfolioOptions: Array<{ label: string; value: string }>
  view?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  created: [tenant: any]
  updated: [tenant: any]
  deleted: [id: string]
}>()

const api = createProtectedApiClient()
const pending = ref(false)

const Schema = object({
  portfolio_id: string(),
  first_name: pipe(string(), minLength(1, 'First name is required')),
  last_name: pipe(string(), minLength(1, 'Last name is required')),
  email: pipe(string(), email('Please enter a valid email address')),
  phone: pipe(string(), minLength(1, 'Phone number is required')),
  is_active: boolean()
})

const form = reactive({
  portfolio_id: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  is_active: true
})

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

watch(() => props.open, (open) => {
  if (open) {
    resetForm()
  }
})

watch(() => props.model, (model) => {
  if (model) {
    form.portfolio_id = String(model.portfolio_id || props.portfolioId || '')
    form.first_name = model.first_name || ''
    form.last_name = model.last_name || ''
    form.email = model.email || ''
    form.phone = model.phone || ''
    form.is_active = model.is_active ?? true
  }
})

watch(() => props.portfolioId, (id) => {
  if (id) {
    form.portfolio_id = String(id)
  }
})

function resetForm() {
  form.portfolio_id = String(props.portfolioId || '')
  form.first_name = ''
  form.last_name = ''
  form.email = ''
  form.phone = ''
  form.is_active = true
}

const errors = reactive<Record<string, string | undefined>>({})

const validate = (state: any) => {
  const result = safeParse(Schema, state)
  if (result.success) {
    Object.keys(errors).forEach((k) => delete errors[k])
    return []
  }
  Object.keys(errors).forEach((k) => delete errors[k])
  result.issues.forEach((issue: any) => {
    const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path[0]?.key : undefined
    if (path && typeof path === 'string') errors[path] = issue.message
  })
  return result.issues
}

async function onSubmit() {
  try {
    pending.value = true
    
    const payload = {
      portfolio_id: String(form.portfolio_id),
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      is_active: form.is_active
    }

    if (props.model) {
      // Update existing tenant
      const res = await api.patch(`/portfolios/${payload.portfolio_id}/tenants/${props.model.id}`, payload)
      emit('updated', res.data || res)
    } else {
      // Create new tenant
      const res = await api.post(`/portfolios/${payload.portfolio_id}/tenants`, payload)
      emit('created', res.data || res)
    }
    
    closeModal()
  } catch (error: any) {
    console.error('Tenant form error:', error)
  } finally {
    pending.value = false
  }
}

async function onDelete() {
  if (!props.model?.id) return
  try {
    pending.value = true
    await api.delete(`/tenants/${props.model.id}`)
    emit('deleted', props.model.id)
    closeModal()
  } catch (error: any) {
    console.error('Delete tenant error:', error)
  } finally {
    pending.value = false
  }
}

function closeModal() {
  emit('update:open', false)
}
</script>
