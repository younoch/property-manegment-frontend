<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-6">
    <h1 class="text-2xl font-semibold mb-4">Profile</h1>
    <UCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            {{ getRoleLabel(user?.role) || '—' }}
          </UBadge>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ROLE_OPTIONS, getRoleColor } from '../constants'
import { useUserStore } from '../stores/user'

definePageMeta({ middleware: 'auth' })
const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

const getRoleLabel = (roleValue: string | undefined): string => {
  if (!roleValue) return '—'
  const role = ROLE_OPTIONS.find((option: { value: string; label: string }) => option.value === roleValue)
  return role?.label || roleValue
}
</script>



