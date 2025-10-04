<template>
  <UModal 
    v-model:open="isOpen" 
    :title="isViewing ? 'View Property' : (isEditing ? 'Edit Property' : 'Add Property')" 
    :ui="{  content: 'w-full sm:max-w-4xl',  header: 'p-2 sm:p-4 min-h-14', body: 'p-2 sm:p-4 ', width: 'w-full sm:max-w-4xl' }" 
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full'
    }">
    
    <template #body>
        <UForm :state="form" :validate="validate" @submit="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <UFormField label="Name" name="name" :error="errors.name" required>
              <UInput v-model="form.name" :disabled="isViewing" placeholder="Sunset Apartments" class="w-full" />
            </UFormField>
    
            <UFormField
              label="Address Line 1"
              name="address_line1"
              :error="errors.address_line1"
              class="sm:col-span-2"
            >
              <UInput v-model="form.address_line1" :disabled="isViewing" placeholder="123 Main Street" class="w-full" />
            </UFormField>
    
            <UFormField
              label="Address Line 2"
              name="address_line2"
              :error="errors.address_line2"
              class="sm:col-span-2"
            >
              <UInput v-model="form.address_line2" :disabled="isViewing" placeholder="Apt 4B" class="w-full" />
            </UFormField>
    
            <UFormField label="City" name="city" :error="errors.city">
              <UInput v-model="form.city" :disabled="isViewing" placeholder="New York" class="w-full" />
            </UFormField>
    
            <UFormField label="State" name="state" :error="errors.state">
              <UInput v-model="form.state" :disabled="isViewing" placeholder="NY" class="w-full" />
            </UFormField>
    
            <UFormField label="Zip Code" name="zip_code" :error="errors.zip_code">
              <UInput v-model="form.zip_code" :disabled="isViewing" placeholder="10001" class="w-full" />
            </UFormField>
    
            <UFormField label="Country" name="country" :error="errors.country">
              <UInput v-model="form.country" :disabled="isViewing" placeholder="USA" class="w-full" />
            </UFormField>

    
            
    
            <UFormField
              label="Property Type"
              name="property_type"
              :error="errors.property_type"
            >
              <USelect
                v-model="form.property_type"
                :disabled="isViewing"
                :items="propertyTypeOptions"
                placeholder="Select type"
                class="w-full"
              />
            </UFormField>
    
            
    
            <UFormField
              label="Description"
              name="description"
              :error="errors.description"
              class="sm:col-span-2"
            >
              <UTextarea
                v-model="form.description"
                :disabled="isViewing"
                :rows="3"
                placeholder="Modern apartment complex with amenities"
                class="w-full"
              />
            </UFormField>
          </div>
    
          <div class="flex items-center justify-end gap-2 mt-6">
            <UButton color="gray" variant="soft" @click.prevent="onClose">{{ isViewing ? 'Close' : 'Cancel' }}</UButton>
            <UButton v-if="!isViewing" type="submit" :loading="submitting">{{ isEditing ? 'Save' : 'Create' }}</UButton>
          </div>
        </UForm>
      
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { safeParse, object, string, number, maxLength, minLength, optional, nullable, pipe } from "valibot";
import { createProtectedApiClient } from "../../utils/api";
import { useApiToast } from "../../composables/useApiToast";
import { PROPERTY_TYPES } from "../../constants/property";
import type {
  AddPropertyPayload,
  CreatedProperty,
} from "../../../types/properties";

const props = defineProps<{
  open: boolean;
  selectedPortfolioId?: string;
  model?: Partial<CreatedProperty> | null;
  view?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'created', value: CreatedProperty): void;
  (e: 'updated', value: CreatedProperty): void;
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
});

const submitting = ref(false);
const api = createProtectedApiClient();
const { success: toastSuccess, error: toastError } = useApiToast();
const isEditing = computed(() => !!props.model?.id)
const isViewing = computed(() => !!props.view)


const propertyTypeOptions = PROPERTY_TYPES;

// Sync portfolio_id with parent selection immediately and on change
watch(() => props.selectedPortfolioId, (id) => {
  if (id && id.length > 0) {
    form.portfolio_id = id
  }
}, { immediate: true })

// Computed effective portfolio id (parent or local)
const effectivePortfolioId = computed(() => {
  const fromProp = props.selectedPortfolioId
  if (fromProp && fromProp.length > 0) return fromProp
  return form.portfolio_id
})

const form = reactive<AddPropertyPayload>({
  portfolio_id: '', // Will be set from props or form
  name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip_code: "",
  country: "USA",
  property_type: "apartment",
  description: "",
});

const errors = reactive<Record<string, string | undefined>>({});

// Geocoding removed for simplified form

const Schema = object({
  portfolio_id: pipe(string(), minLength(1, 'Portfolio is required')),
  name: pipe(string(), minLength(2, "Name must be at least 2 characters")),
  address_line1: pipe(
    string(),
    minLength(3, "Address must be at least 3 characters")
  ),
  address_line2: optional(string()),
  city: pipe(string(), minLength(2, "City must be at least 2 characters")),
  state: pipe(
    string(),
    minLength(2, "State code must be 2+ characters"),
    maxLength(32, "State must be at most 32 characters")
  ),
  zip_code: pipe(
    string(),
    minLength(3, "Zip code must be at least 3 characters")
  ),
  country: pipe(
    string(),
    minLength(2, "Country must be at least 2 characters")
  ),
  property_type: pipe(
    string(),
    minLength(3, "Type must be at least 3 characters")
  ),
  description: optional(nullable(string())),
});

const validate = (state: AddPropertyPayload) => {
  const result = safeParse(Schema, state);
  if (result.success) {
    Object.keys(errors).forEach((k) => delete errors[k]);
    return [];
  }

  // Clear previous errors
  Object.keys(errors).forEach((k) => delete errors[k]);

  // Map validation errors
  result.issues.forEach((issue: any) => {
    const path =
      Array.isArray(issue.path) && issue.path.length > 0
        ? issue.path[0]?.key
        : undefined;
    if (path && typeof path === "string") {
      errors[path] = issue.message;
    }
  });

  return result.issues;
};

const resetForm = () => {
  form.portfolio_id = props.selectedPortfolioId || '';
  form.name = "";
  form.address_line1 = "";
  form.address_line2 = "";
  form.city = "";
  form.state = "";
  form.zip_code = "";
  form.country = "USA";
  form.property_type = "apartment";
  form.description = "";

  // Clear any validation errors
  Object.keys(errors).forEach((k) => delete errors[k]);
};

const onClose = () => {
  isOpen.value = false;
};

// Reset form when modal opens
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      resetForm();
      if (props.model && props.model.id) {
        form.name = String(props.model.name || '')
        form.address_line1 = String(props.model.address_line1 || '')
        form.address_line2 = String(props.model.address_line2 || '')
        form.city = String(props.model.city || '')
        form.state = String(props.model.state || '')
        form.zip_code = String(props.model.zip_code || '')
        form.country = String(props.model.country || 'USA')
        form.property_type = String(props.model.property_type || 'apartment')
        form.portfolio_id = String(props.model.portfolio_id || '')
      }
    }
  }
);

const onSubmit = async () => {
  const validation = validate(form);
  if (validation.length) return;
  submitting.value = true;
  try {
    const payload = { ...form } as any
    if ('number_of_units' in payload) delete payload.number_of_units
    // Ensure portfolio_id comes from parent selection if provided
    payload.portfolio_id = effectivePortfolioId.value

    if (isEditing.value && props.model?.id) {
      const response = await api.patch<any>(`/properties/${props.model.id}`, payload)
      toastSuccess(response?.message || 'Property updated')
      emit('updated', response?.data ?? { id: props.model.id, ...payload })
    } else {
      // Apply default coordinates for creation, hidden from the form
      if (typeof payload.latitude !== 'number') payload.latitude = 44.5
      if (typeof payload.longitude !== 'number') payload.longitude = -89.5
      
      // Ensure portfolio_id is a string
      const portfolioId = String(effectivePortfolioId.value || '')
      if (!portfolioId) {
        throw new Error('Portfolio ID is required')
      }
      
      const response = await api.post<any>(`/portfolios/${portfolioId}/properties`, payload)
      toastSuccess(response?.message || 'Property created')
      emit('created', response?.data ?? { ...payload })
    }
    isOpen.value = false
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to create property";
    toastError(message);
  } finally {
    submitting.value = false;
  }
};
</script>
