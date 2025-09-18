<template>
  <UCard :ui="{
    base: 'h-full flex flex-col',
    body: { base: 'flex-1 flex flex-col' },
    footer: { base: 'pt-0' }
  }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ title }}</h3>
        <UButton
          v-if="showViewAll"
          color="gray"
          variant="ghost"
          size="xs"
          :to="viewAllRoute"
          label="View All"
          trailing-icon="i-heroicons-arrow-right"
        />
      </div>
    </template>

    <div class="flex-1 overflow-hidden">
      <UTable 
        :rows="items" 
        :columns="columns"
        :loading="loading"
        :loading-state="{
          icon: 'i-heroicons-arrow-path',
          label: 'Loading...',
        }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items found.'
        }"
        :ui="{
          wrapper: 'h-full',
          tbody: 'divide-y divide-gray-200 dark:divide-gray-800',
          th: { base: 'text-left rtl:text-right', padding: 'px-4 py-3', color: 'text-gray-500 dark:text-gray-400' },
          td: { base: 'whitespace-nowrap', padding: 'px-4 py-3' }
        }"
      >
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6">
            <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 mb-2" />
            <p class="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        </template>

        <template #loading-state>
          <div class="flex items-center justify-center py-6">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6 text-primary-500 mr-2" />
            <span>Loading...</span>
          </div>
        </template>

        <template #empty>
          <div class="flex items-center justify-center py-6 text-gray-500">
            No data available
          </div>
        </template>
      </UTable>
    </div>

    <template #footer>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div v-if="pagination" class="flex items-center gap-1">
          <span>Showing</span>
          <span class="font-medium">{{ pagination.from }}-{{ pagination.to }}</span>
          <span>of</span>
          <span class="font-medium">{{ pagination.total }}</span>
          <span>items</span>
        </div>
        <div v-else-if="items.length > 0" class="text-sm text-gray-500">
          Showing {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
        </div>
        <div v-else></div>

        <UPagination
          v-if="pagination && pagination.total > pagination.perPage"
          v-model="currentPage"
          :page-count="pagination.perPage"
          :total="pagination.total"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline'
              }
            }
          }"
          @update:modelValue="onPageChange"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

// Define column type for better type safety
type Column = {
  key: string;
  label: string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  class?: string;
  [key: string]: any;
};

defineProps({
  title: {
    type: String,
    required: true
  },
  columns: {
    type: Array as unknown as () => Column[],
    required: true
  },
  items: {
    type: Array as unknown as () => any[],
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showViewAll: {
    type: Boolean,
    default: false
  },
  viewAllRoute: {
    type: String,
    default: '#'
  },
  pagination: {
    type: [Object, null] as unknown as () => {
      from: number;
      to: number;
      total: number;
      perPage: number;
    } | null,
    default: null
  }
});

const emit = defineEmits(['page-change']);

const currentPage = ref(1);

const onPageChange = (page: number) => {
  currentPage.value = page;
  emit('page-change', page);
};
</script>
