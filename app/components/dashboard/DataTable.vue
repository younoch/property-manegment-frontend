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
      <div class="w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                :class="[column.class]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td :colspan="columns.length" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center">
                  <UIcon name="i-heroicons-arrow-path" class="animate-spin w-5 h-5 text-primary-500 mr-2" />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="!items || items.length === 0">
              <td :colspan="columns.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center justify-center py-6">
                  <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 mb-2" />
                  <p>No data available</p>
                </div>
              </td>
            </tr>
            <template v-else>
              <tr v-for="(item, index) in items" :key="item.id || index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td 
                  v-for="column in columns" 
                  :key="column.key"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  <slot :name="column.key" :value="item[column.key]" :item="item">
                    {{ item[column.key] }}
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
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
