<template>
  <UModal v-model:open="isOpen" title="Add Property" :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold"></h3>
        <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          @click="onClose"
        />
      </div>
    </template>
    
    <template #body>
      <UPlaceholder class="h-fit">
        <UForm :state="form" :validate="validate" @submit="onSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Name" name="name" :error="errors.name">
              <UInput v-model="form.name" placeholder="Sunset Apartments" />
            </UFormField>
    
            <UFormField
              label="Address Line 1"
              name="address_line1"
              :error="errors.address_line1"
              class="sm:col-span-2"
            >
              <UInput v-model="form.address_line1" placeholder="123 Main Street" />
            </UFormField>
    
            <UFormField
              label="Address Line 2"
              name="address_line2"
              :error="errors.address_line2"
              class="sm:col-span-2"
            >
              <UInput v-model="form.address_line2" placeholder="Apt 4B" />
            </UFormField>
    
            <UFormField label="City" name="city" :error="errors.city">
              <UInput v-model="form.city" placeholder="New York" />
            </UFormField>
    
            <UFormField label="State" name="state" :error="errors.state">
              <UInput v-model="form.state" placeholder="NY" />
            </UFormField>
    
            <UFormField label="Zip Code" name="zip_code" :error="errors.zip_code">
              <UInput v-model="form.zip_code" placeholder="10001" />
            </UFormField>
    
            <UFormField label="Country" name="country" :error="errors.country">
              <UInput v-model="form.country" placeholder="USA" />
            </UFormField>

            <!-- Geocoding Button -->
            <div class="sm:col-span-2">
              <UButton
                @click="geocodeAddress"
                :loading="geocoding"
                color="blue"
                variant="soft"
                class="w-full"
                :disabled="!canGeocode"
              >
                <UIcon name="i-heroicons-map-pin" class="mr-2" />
                {{ geocoding ? 'Getting coordinates...' : 'Get Coordinates from Address' }}
              </UButton>
              <p class="text-xs text-gray-500 mt-1">
                Click to automatically get latitude and longitude from the address above
              </p>
            </div>

            <!-- Map Preview -->
            <div v-if="form.latitude && form.longitude" class="sm:col-span-2">
              <div class="bg-gray-100 rounded-lg p-3">
                <p class="text-sm font-medium mb-2">Location Preview:</p>
                <div class="bg-white rounded border p-3 text-center">
                  <a 
                    :href="`https://www.openstreetmap.org/?mlat=${form.latitude}&mlon=${form.longitude}&zoom=15`"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <UIcon name="i-heroicons-map" class="inline mr-1" />
                    View on OpenStreetMap
                  </a>
                  <p class="text-xs text-gray-600 mt-1">
                    Coordinates: {{ form.latitude.toFixed(6) }}, {{ form.longitude.toFixed(6) }}
                  </p>
                </div>
              </div>
            </div>
    
            <UFormField label="Latitude" name="latitude" :error="errors.latitude">
              <UInput
                v-model.number="form.latitude"
                type="number"
                step="0.000001"
                placeholder="40.7128"
              />
            </UFormField>
    
            <UFormField
              label="Longitude"
              name="longitude"
              :error="errors.longitude"
            >
              <UInput
                v-model.number="form.longitude"
                type="number"
                step="0.000001"
                placeholder="-74.0060"
              />
            </UFormField>
    
            <UFormField
              label="Property Type"
              name="property_type"
              :error="errors.property_type"
            >
              <USelect
                v-model="form.property_type"
                :options="propertyTypeOptions"
                placeholder="Select type"
              />
            </UFormField>
    
            <UFormField
              label="Number of Units"
              name="number_of_units"
              :error="errors.number_of_units"
            >
              <UInput
                v-model.number="form.number_of_units"
                type="number"
                min="0"
                placeholder="24"
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
                :rows="3"
                placeholder="Modern apartment complex with amenities"
              />
            </UFormField>
          </div>
    
          <div class="flex items-center justify-end gap-2 mt-6">
            <UButton color="gray" variant="soft" @click.prevent="onClose"
              >Cancel</UButton
            >
            <UButton type="submit" :loading="submitting">Create</UButton>
          </div>
        </UForm>
      </UPlaceholder>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import {
  safeParse,
  object,
  string,
  number,
  minLength,
  maxLength,
  optional,
  nullable,
  pipe,
} from "valibot";
import { createProtectedApiClient } from "../../utils/api";
import { useApiToast } from "../../composables/useApiToast";
import type {
  AddPropertyPayload,
  CreatedProperty,
} from "../../../types/properties";
const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  created: [value: CreatedProperty];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
});

const submitting = ref(false);
const geocoding = ref(false);
const api = createProtectedApiClient();
const { success: toastSuccess, error: toastError } = useApiToast();

const propertyTypeOptions = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Condo", value: "condo" },
  { label: "Land", value: "land" },
];

const form = reactive<AddPropertyPayload>({
  name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip_code: "",
  country: "USA",
  latitude: null,
  longitude: null,
  property_type: "apartment",
  number_of_units: 0,
  description: "",
});

const errors = reactive<Record<string, string | undefined>>({});

// Check if we have enough address info to geocode
const canGeocode = computed(() => {
  return form.address_line1 && form.city && form.state;
});

// Geocoding function using OpenStreetMap Nominatim
const geocodeAddress = async () => {
  if (!canGeocode.value) {
    toastError("Please fill in at least Address Line 1, City, and State");
    return;
  }

  geocoding.value = true;
  try {
    // Build address string
    const addressParts = [
      form.address_line1,
      form.address_line2,
      form.city,
      form.state,
      form.zip_code,
      form.country
    ].filter(Boolean);
    
    const addressString = addressParts.join(', ');
    
    // Use OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const location = data[0];
      form.latitude = parseFloat(location.lat);
      form.longitude = parseFloat(location.lon);
      
      toastSuccess(`Coordinates found: ${form.latitude.toFixed(6)}, ${form.longitude.toFixed(6)}`);
    } else {
      toastError("Address not found. Please check the address and try again.");
    }
  } catch (error: any) {
    console.error('Geocoding error:', error);
    toastError("Failed to get coordinates. Please enter them manually.");
  } finally {
    geocoding.value = false;
  }
};

const Schema = object({
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
  latitude: optional(nullable(number())),
  longitude: optional(nullable(number())),
  property_type: pipe(
    string(),
    minLength(3, "Type must be at least 3 characters")
  ),
  number_of_units: number(),
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
  form.name = "";
  form.address_line1 = "";
  form.address_line2 = "";
  form.city = "";
  form.state = "";
  form.zip_code = "";
  form.country = "USA";
  form.latitude = null;
  form.longitude = null;
  form.property_type = "apartment";
  form.number_of_units = 0;
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
    }
  }
);

const onSubmit = async () => {
  const validation = validate(form);
  if (validation.length) return;
  submitting.value = true;
  try {
    // Send coordinates as numbers (international standard)
    const payload = { ...form };
    
    // Enhanced debugging for backend issue
    console.log('=== PROPERTY SUBMISSION DEBUG ===');
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    console.log('Latitude:', {
      value: payload.latitude,
      type: typeof payload.latitude,
      isNumber: typeof payload.latitude === 'number',
      isFinite: Number.isFinite(payload.latitude),
      precision: payload.latitude?.toString().split('.')[1]?.length || 0
    });
    console.log('Longitude:', {
      value: payload.longitude,
      type: typeof payload.longitude,
      isNumber: typeof payload.longitude === 'number',
      isFinite: Number.isFinite(payload.longitude),
      precision: payload.longitude?.toString().split('.')[1]?.length || 0
    });
    console.log('=== END DEBUG ===');
    
    const response = await api.post<any>("/properties", payload);
    toastSuccess(response?.message || "Property created");
    emit("created", response?.data ?? { ...form });
    isOpen.value = false;
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to create property";
    toastError(message);
    
    // Enhanced error logging
    console.error('=== BACKEND ERROR DEBUG ===');
    console.error('Error object:', err);
    console.error('Error message:', err?.message);
    console.error('Response data:', err?.data);
    console.error('Status code:', err?.status || err?.response?.status);
    console.error('=== END ERROR DEBUG ===');
  } finally {
    submitting.value = false;
  }
};
</script>
