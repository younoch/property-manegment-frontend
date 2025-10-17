<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl md:text-2xl font-semibold">Profile</h1>
      <UButton
        icon="i-heroicons-pencil-square"
        color="primary"
        variant="solid"
        @click="showEditModal = true"
      >
        Edit Profile
      </UButton>
    </div>
    
    <UCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Profile Image Section -->
        <div class="sm:col-span-2 flex flex-col items-center sm:items-start sm:flex-row gap-4">
          <div class="relative">
            <img
              v-if="user?.profile_image_url"
              :src="user.profile_image_url"
              :alt="user?.name || 'Profile'"
              class="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <div
              v-else
              class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200"
            >
              <UIcon name="i-heroicons-user" class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <div class="text-center sm:text-left">
            <h2 class="text-xl font-semibold">{{ user?.name || '—' }}</h2>
            <p class="text-gray-600">{{ user?.role ? getRoleLabel(user.role) : '—' }}</p>
          </div>
        </div>

        <!-- Profile Details -->
        <div>
          <p class="text-sm text-gray-500">Name</p>
          <p class="text-base font-medium">{{ user?.name || '—' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="text-base font-medium">{{ user?.email || '—' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Phone</p>
          <p class="text-base font-medium">{{ user?.phone || '—' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Role</p>
          <UBadge :color="user?.role ? getRoleColor(user.role) : 'gray'">
            {{ user?.role ? getRoleLabel(user.role) : '—' }}
          </UBadge>
        </div>
        <div>
          <p class="text-sm text-gray-500">Status</p>
          <UBadge :color="user?.is_active ? 'success' : 'gray'">
            {{ user?.is_active ? 'Active' : 'Inactive' }}
          </UBadge>
        </div>
      </div>
    </UCard>

    <!-- Profile Update Modal -->
    <UserProfileUpdateModal
      v-model:open="showEditModal"
      @updated="onProfileUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ROLE_OPTIONS, getRoleColor, getRoleLabel } from '@/constants'
import { useUserStore } from '@/stores/user'
import UserProfileUpdateModal from '@/components/profile/UserProfileUpdateModal.vue'

definePageMeta({ middleware: 'auth' })

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)
const showEditModal = ref(false)



const onProfileUpdated = (updatedData: any) => {
  // The user store is already updated by the modal component
}
</script>



