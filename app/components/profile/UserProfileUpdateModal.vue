<template>
  <UModal 
    v-model:open="isOpen" 
    title="Update Profile" 
    :ui="{ body: 'p-3', content: 'w-full sm:max-w-3xl' }"
   :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full'
    }">
    
    <template #body>
      <div class="h-fit">
        <UForm :state="form" :validate="validate" @submit="onSubmit">
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <p class="text-xs text-gray-600">
                <span class="text-red-500">*</span> Required fields
              </p>
              <div class="flex items-center gap-2">
                <div class="text-xs text-gray-500">
                  Form completion: {{ formCompletionPercentage }}%
                </div>
                <div class="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: formCompletionPercentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Name *" name="name" :error="errors.name">
              <div class="relative">
                <UInput v-model="form.name" placeholder="John Doe" />
                <UButton
                  type="button"
                  icon="i-heroicons-question-mark-circle"
                  color="gray"
                  variant="ghost"
                  size="xs"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2"
                  @click="showNameHelp = !showNameHelp"
                />
              </div>
              <div v-if="showNameHelp" class="mt-1 p-2 bg-blue-50 rounded text-xs text-blue-700">
                Enter your full name as it should appear on official documents.
              </div>
            </UFormField>
    
            <UFormField label="Email *" name="email" :error="errors.email">
              <UInput v-model="form.email" type="email" placeholder="john.doe@example.com" />
            </UFormField>
    
            <UFormField label="Phone *" name="phone" :error="errors.phone">
              <UInput v-model="form.phone" placeholder="+1-555-123-4567" />
            </UFormField>
    
            <UFormField label="Role *" name="role" :error="errors.role">
              <USelect
                v-model="form.role"
                :items="roleOptions"
                placeholder="Select role"
              />
            </UFormField>
    
            <UFormField
              label="Profile Image URL"
              name="profile_image_url"
              :error="errors.profile_image_url"
              class="sm:col-span-2"
            >
              <UInput v-model="form.profile_image_url" placeholder="https://example.com/images/profile.jpg" />
              <div v-if="form.profile_image_url" class="mt-2">
                <p class="text-xs text-gray-500 mb-2">Preview:</p>
                <img
                  :src="form.profile_image_url"
                  :alt="form.name || 'Profile'"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  @error="handleImageError"
                />
              </div>
            </UFormField>
    
            <UFormField
              label="Active Status"
              name="is_active"
              class="sm:col-span-2"
            >
              <UCheckbox v-model="form.is_active" />
              <p class="text-xs text-gray-500 mt-1">Check to keep account active</p>
            </UFormField>
          </div>

          <!-- Changes Summary -->
          <div v-if="hasChanges" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="text-sm font-medium text-blue-800 mb-2">Changes Summary</h4>
            <div class="space-y-1">
              <div v-if="form.name !== originalValues.name" class="text-xs text-blue-700">
                <span class="font-medium">Name:</span> {{ originalValues.name }} → {{ form.name }}
              </div>
              <div v-if="form.email !== originalValues.email" class="text-xs text-blue-700">
                <span class="font-medium">Email:</span> {{ originalValues.email }} → {{ form.email }}
              </div>
              <div v-if="form.phone !== originalValues.phone" class="text-xs text-blue-700">
                <span class="font-medium">Phone:</span> {{ originalValues.phone }} → {{ form.phone }}
              </div>
              <div v-if="form.role !== originalValues.role" class="text-xs text-blue-700">
                <span class="font-medium">Role:</span> {{ getRoleLabel(originalValues.role) }} → {{ getRoleLabel(form.role) }}
              </div>
              <div v-if="form.profile_image_url !== originalValues.profile_image_url" class="text-xs text-blue-700">
                <span class="font-medium">Profile Image:</span> {{ originalValues.profile_image_url || 'None' }} → {{ form.profile_image_url || 'None' }}
              </div>
              <div v-if="form.is_active !== originalValues.is_active" class="text-xs text-blue-700">
                <span class="font-medium">Status:</span> {{ originalValues.is_active ? 'Active' : 'Inactive' }} → {{ form.is_active ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </div>

          <!-- Form Validation Status -->
          <div class="mt-4 p-3 rounded-lg" :class="validationStatusClass">
            <div class="flex items-center gap-2">
              <UIcon :name="validationStatusIcon" class="w-4 h-4" />
              <span class="text-sm font-medium">{{ validationStatusMessage }}</span>
            </div>
          </div>
    
          <div class="flex items-center justify-between mt-6">
              <div class="flex items-center gap-2">
                <UButton 
                  color="blue" 
                  variant="soft" 
                  size="sm"
                  @click="copyCurrentValues"
                >
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-1" />
                  Reset to Current Values
                </UButton>
                
                <UButton 
                  v-if="hasChanges"
                  color="green" 
                  variant="soft" 
                  size="sm"
                  @click="saveDraft"
                >
                  <UIcon name="i-heroicons-bookmark" class="w-4 h-4 mr-1" />
                  Save Draft
                </UButton>
              </div>
              
              <div class="flex items-center gap-2">
                <UButton color="gray" variant="soft" @click.prevent="onClose">
                  Cancel
                </UButton>
                <UButton 
                  type="submit" 
                  :loading="submitting"
                  :disabled="!hasChanges"
                >
                  Update Profile
                </UButton>
              </div>
            </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import {
  safeParse,
  object,
  string,
  boolean,
  optional,
  pipe,
  minLength,
  maxLength,
  email
} from "valibot";
import { createProtectedApiClient } from "../../utils/api";
import { useApiToast } from "../../composables/useApiToast";
import { ROLE_OPTIONS, getRoleLabel } from "../../constants/roles";
import { useUserStore } from "../../stores/user";

interface ProfileUpdatePayload {
  email: string;
  name: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'manager' | 'super_admin';
  profile_image_url?: string;
  is_active: boolean;
}

const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  updated: [value: any];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
});

const submitting = ref(false);
const api = createProtectedApiClient();
const { success: toastSuccess, error: toastError } = useApiToast();
const userStore = useUserStore();

const roleOptions = ROLE_OPTIONS;

const form = reactive<ProfileUpdatePayload>({
  email: "",
  name: "",
  phone: "",
  role: "tenant",
  profile_image_url: "",
  is_active: true
});

const originalValues = ref<ProfileUpdatePayload>({
  email: "",
  name: "",
  phone: "",
  role: "tenant",
  profile_image_url: "",
  is_active: true
});

const hasChanges = computed(() => {
  return form.email !== originalValues.value.email ||
         form.name !== originalValues.value.name ||
         form.phone !== originalValues.value.phone ||
         form.role !== originalValues.value.role ||
         form.profile_image_url !== originalValues.value.profile_image_url ||
         form.is_active !== originalValues.value.is_active;
});

const formCompletionPercentage = computed(() => {
  const requiredFields = ['email', 'name', 'phone', 'role'];
  const completedFields = requiredFields.filter(field => 
    form[field as keyof ProfileUpdatePayload] && 
    String(form[field as keyof ProfileUpdatePayload]).trim() !== ''
  );
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
});

const validationStatusClass = computed(() => {
  if (Object.keys(errors).length > 0) {
    return 'bg-red-50 border border-red-200 text-red-700';
  } else if (formCompletionPercentage.value === 100) {
    return 'bg-green-50 border border-green-200 text-green-700';
  } else {
    return 'bg-yellow-50 border border-yellow-200 text-yellow-700';
  }
});

const validationStatusIcon = computed(() => {
  if (Object.keys(errors).length > 0) {
    return 'i-heroicons-exclamation-triangle';
  } else if (formCompletionPercentage.value === 100) {
    return 'i-heroicons-check-circle';
  } else {
    return 'i-heroicons-clock';
  }
});

const validationStatusMessage = computed(() => {
  if (Object.keys(errors).length > 0) {
    return 'Please fix the validation errors above';
  } else if (formCompletionPercentage.value === 100) {
    return 'Form is complete and ready to submit';
  } else {
    return 'Please complete all required fields';
  }
});

const showNameHelp = ref(false);
const errors = reactive<Record<string, string | undefined>>({});

const Schema = object({
  email: pipe(string(), email("Please enter a valid email address")),
  name: pipe(string(), minLength(2, "Name must be at least 2 characters")),
  phone: pipe(string(), minLength(10, "Phone must be at least 10 characters")),
  role: pipe(string(), minLength(3, "Role must be at least 3 characters")),
  profile_image_url: optional(string()),
  is_active: boolean()
});

const validate = (state: ProfileUpdatePayload) => {
  const result = safeParse(Schema, state);
  
  // Clear previous errors
  Object.keys(errors).forEach((k) => delete errors[k]);

  // Profile image URL validation
  if (state.profile_image_url && !isValidUrl(state.profile_image_url)) {
    errors.profile_image_url = "Please enter a valid URL";
  }

  // Phone validation
  if (state.phone && !isValidPhone(state.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (result.success) {
    return [];
  }

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
  const currentUser = userStore.currentUser;
  if (currentUser) {
    form.email = currentUser.email;
    form.name = currentUser.name;
    form.phone = currentUser.phone;
    form.role = currentUser.role;
    form.profile_image_url = currentUser.profile_image_url || "";
    form.is_active = currentUser.is_active ?? true;
    
    // Set original values for comparison
    originalValues.value = {
      email: currentUser.email,
      name: currentUser.name,
      phone: currentUser.phone,
      role: currentUser.role,
      profile_image_url: currentUser.profile_image_url || "",
      is_active: currentUser.is_active ?? true
    };
  }

  // Clear any validation errors
  Object.keys(errors).forEach((k) => delete errors[k]);
};

const onClose = () => {
  isOpen.value = false;
};

const handleImageError = () => {
  toastError("Invalid image URL. Please check the URL and try again.");
  form.profile_image_url = "";
};

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidPhone = (phone: string): boolean => {
  // Basic phone validation - allows international formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const copyCurrentValues = () => {
  const currentUser = userStore.currentUser;
  if (currentUser) {
    form.email = currentUser.email;
    form.name = currentUser.name;
    form.phone = currentUser.phone;
    form.role = currentUser.role;
    form.profile_image_url = currentUser.profile_image_url || "";
    form.is_active = currentUser.is_active ?? true;
    
    // Set original values for comparison
    originalValues.value = {
      email: currentUser.email,
      name: currentUser.name,
      phone: currentUser.phone,
      role: currentUser.role,
      profile_image_url: currentUser.profile_image_url || "",
      is_active: currentUser.is_active ?? true
    };
    
    // Clear errors
    Object.keys(errors).forEach((k) => delete errors[k]);
    
    // Reset help state
    showNameHelp.value = false;
    
    toastSuccess("Form reset to current values");
  }
};

const saveDraft = () => {
  try {
    const draft = {
      email: form.email,
      name: form.name,
      phone: form.phone,
      role: form.role,
      profile_image_url: form.profile_image_url,
      is_active: form.is_active
    };
    
    if (process.client) {
      localStorage.setItem('profileUpdateDraft', JSON.stringify(draft));
      toastSuccess("Draft saved successfully");
    }
  } catch (error) {
    toastError("Failed to save draft");
  }
};

// Reset form when modal opens
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      resetForm();
      loadDraft();
    }
  }
);

const loadDraft = () => {
  try {
    if (process.client) {
      const draft = localStorage.getItem('profileUpdateDraft');
      if (draft) {
        const draftData = JSON.parse(draft);
        // Only load draft if it's for the current user
        const currentUser = userStore.currentUser;
        if (currentUser && draftData.email === currentUser.email) {
          form.email = draftData.email;
          form.name = draftData.name;
          form.phone = draftData.phone;
          form.role = draftData.role;
          form.profile_image_url = draftData.profile_image_url || "";
          form.is_active = draftData.is_active ?? true;
          
          toastSuccess("Draft loaded successfully");
        }
      }
    }
  } catch (error) {
    // Handle error silently
  }
};

const onSubmit = async () => {
  const validation = validate(form);
  if (validation.length) return;
  
  // Check for role change warning
  const currentUser = userStore.currentUser;
  if (currentUser && form.role !== currentUser.role) {
    const confirmed = confirm(`Are you sure you want to change your role from "${getRoleLabel(currentUser.role)}" to "${getRoleLabel(form.role)}"? This may affect your access permissions.`);
    if (!confirmed) {
      return;
    }
  }
  
  submitting.value = true;
  try {
    if (!currentUser?.id) {
      throw new Error("User ID not found");
    }

    // Create payload
    const payload = { ...form };
    if (!payload.profile_image_url) {
      delete payload.profile_image_url;
    }

    const response = await api.patch<any>(`/users/${currentUser.id}`, payload);
    
    // Update local user store
    userStore.updateUser(payload);
    
    // Clear draft after successful update
    if (process.client) {
      localStorage.removeItem('profileUpdateDraft');
    }
    
    toastSuccess(response?.message || "Profile updated successfully");
    emit("updated", response?.data ?? payload);
    isOpen.value = false;
  } catch (err: any) {
    const message =
      err?.data?.message || err?.message || "Failed to update profile";
    toastError(message);
  } finally {
    submitting.value = false;
  }
};
</script>
