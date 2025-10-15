<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">User Feedback</h1>
      <p class="text-gray-600 dark:text-gray-400">Browse and triage feedback submitted across the platform.</p>
    </div>

    <UCard>
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="font-medium">Feedback list</div>
          <div class="flex flex-wrap items-center gap-2">
            <USelectMenu 
              v-model="filters.type" 
              :options="typeOptions"
              placeholder="Type"
              size="sm"
              class="w-32"
            />
            <USelectMenu 
              v-model="filters.status" 
              :options="statusOptions"
              placeholder="Status"
              size="sm"
              class="w-36"
            />
            <UInput 
              v-model="filters.query" 
              placeholder="Search..." 
              size="sm"
              class="w-48"
            />
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <UTable
          :columns="columns"
          :rows="filteredFeedback"
          :loading="loading"
          :loading-state="{ label: 'Loading...' }"
          :empty-state="{ label: 'No feedback found' }"
          :ui="{ thead: 'bg-gray-50 dark:bg-gray-800', th: 'font-medium' }"
          class="w-full"
        >
          <template #type-data="{ row }">
            <UBadge :color="getTypeColor(row.type)" variant="soft">
              {{ row.type }}
            </UBadge>
          </template>
          
          <template #rating-data="{ row }">
            <div class="flex items-center gap-1">
              <span class="text-yellow-500">
                {{ '★'.repeat(Math.round(row.rating)) }}
                {{ '☆'.repeat(5 - Math.round(row.rating)) }}
              </span>
              <span class="text-sm text-gray-500">({{ row.rating.toFixed(1) }})</span>
            </div>
          </template>
          
          <template #status-data="{ row }">
            <UBadge :color="getStatusColor(row.status)" variant="subtle">
              {{ formatStatus(row.status) }}
            </UBadge>
          </template>
          
          <template #actions-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-eye"
                @click="viewDetails(row)"
              />
              <UButton
                color="green"
                variant="ghost"
                icon="i-heroicons-check"
                @click="markResolved(row)"
              />
            </div>
          </template>
        </UTable>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing <span class="font-medium">{{ (page - 1) * pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(page * pageSize, filteredFeedback?.length || 0) }}</span> of 
            <span class="font-medium">{{ filteredFeedback?.length || 0 }}</span> results
          </div>
          <UPagination
            v-model="page"
            :page-count="pageSize"
            :total="filteredFeedback?.length || 0"
            :ui="{ rounded: 'first:rounded-s-md last:rounded-e-md' }"
            v-if="filteredFeedback?.length > 0"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, h, resolveComponent } from 'vue'
import { definePageMeta } from '#imports'

// Import UI components
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

// Define type for table columns
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
  cell?: (cell: any) => any;
}

type Feedback = {
  id: string
  title: string
  message: string
  type: 'bug' | 'feature' | 'idea' | 'other'
  rating: number
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
  user?: {
    name: string
    email: string
  }
}

definePageMeta({ layout: 'monitoring' })

// State
const loading = ref(false)
const page = ref(1)
const pageSize = 10

// Filters
const filters = reactive({
  type: 'all',
  status: 'all',
  query: ''
})

const typeOptions = [
  { value: 'all', label: 'All types' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'idea', label: 'Idea' },
  { value: 'other', label: 'Other' }
]

const statusOptions = [
  { value: 'all', label: 'All status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' }
]

// Sample data - replace with API call
const feedback = ref<Feedback[]>([
  { 
    id: 'fd_1', 
    title: 'Cannot upload lease PDF', 
    message: 'Upload fails with 413 error on large files', 
    type: 'bug', 
    rating: 3, 
    status: 'open', 
    createdAt: '2025-10-15 21:01',
    user: { name: 'Alex Johnson', email: 'alex@example.com' }
  },
  { 
    id: 'fd_2', 
    title: 'Add bulk tenant import', 
    message: 'CSV upload for tenants would be helpful', 
    type: 'feature', 
    rating: 5, 
    status: 'in_progress', 
    createdAt: '2025-10-15 19:44',
    user: { name: 'Maria Garcia', email: 'maria@example.com' }
  },
  { 
    id: 'fd_3', 
    title: 'Dark mode scheduling', 
    message: 'Auto switch based on system time', 
    type: 'idea', 
    rating: 4, 
    status: 'resolved', 
    createdAt: '2025-10-14 10:02',
    user: { name: 'James Wilson', email: 'james@example.com' }
  },
  { 
    id: 'fd_4', 
    title: 'Invoice email copy', 
    message: 'Improve clarity in the invoice email template', 
    type: 'other', 
    rating: 4, 
    status: 'open', 
    createdAt: '2025-10-13 16:27',
    user: { name: 'Sarah Kim', email: 'sarah@example.com' }
  },
  // Add more sample data for pagination
  ...Array.from({ length: 15 }, (_, i) => {
    const feedbackTypes: Array<'bug' | 'feature' | 'idea' | 'other'> = ['bug', 'feature', 'idea', 'other'];
    const statuses: Array<'open' | 'in_progress' | 'resolved'> = ['open', 'in_progress', 'resolved'];
    const randomType = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)]!;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]!;
    
    return {
      id: `fd_${i+5}`,
      title: `Sample feedback ${i+5}`,
      message: `This is a sample feedback item #${i+5} with some details.`,
      type: randomType,
      rating: Math.floor(Math.random() * 5) + 1,
      status: randomStatus,
      createdAt: `2025-10-${String(15 - Math.floor(i/3)).padStart(2, '0')} ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      user: {
        name: `User ${i+1}`,
        email: `user${i+1}@example.com`
      }
    } as const;
  })
])

// Table columns
const columns: TableColumn[] = [
  { 
    key: 'title', 
    label: 'Title',
    sortable: true
  },
  { 
    key: 'type', 
    label: 'Type',
    sortable: true,
    cell: (row: any) => h(UBadge, { 
      color: getTypeColor(row.type),
      variant: 'soft',
      class: 'capitalize'
    }, { default: () => row.type })
  },
  { 
    key: 'rating', 
    label: 'Rating',
    sortable: true,
    cell: (row: any) => {
      const rating = row.rating || 0
      return h('div', { class: 'flex items-center gap-1' }, [
        ...Array(5).fill(0).map((_, i) => 
          h(UIcon, { 
            name: i < rating ? 'i-heroicons-star-solid' : 'i-heroicons-star',
            class: [
              'w-4 h-4',
              i < rating ? 'text-amber-500' : 'text-gray-300'
            ]
          })
        ),
        h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 ml-1' }, `(${rating})`)
      ])
    }
  },
  { 
    key: 'status', 
    label: 'Status',
    sortable: true,
    cell: (row: any) => h(UBadge, { 
      color: getStatusColor(row.status),
      variant: 'subtle',
      class: 'capitalize'
    }, { default: () => formatStatus(row.status) })
  },
  { 
    key: 'user', 
    label: 'Submitted By',
    sortable: true,
    cell: (row: any) => row.user?.name || 'Anonymous'
  },
  { 
    key: 'createdAt', 
    label: 'Submitted',
    sortable: true
  },
  {
    key: 'actions',
    label: '',
    class: 'w-32 text-right',
    cell: (row: any) => h('div', { class: 'flex justify-end gap-2' }, [
      row.status !== 'resolved' && h(
        UButton, 
        { 
          size: '2xs',
          color: 'green',
          variant: 'soft',
          onClick: () => markResolved(row)
        },
        { default: () => 'Resolve' }
      ),
      h(
        UButton,
        {
          size: '2xs',
          variant: 'ghost',
          color: 'gray',
          onClick: () => viewDetails(row)
        },
        { default: () => 'View' }
      )
    ].filter(Boolean))
  }
]

// Computed
const filteredFeedback = computed<Feedback[]>(() => {
  if (!feedback.value) return [];
  
  return feedback.value.filter((f: Feedback) => {
    // Type filter
    const typeMatch = filters.type === 'all' || f.type === filters.type;
    
    // Status filter
    const statusMatch = filters.status === 'all' || f.status === filters.status;
    
    // Search query filter
    let queryMatch = true;
    if (filters.query) {
      const query = filters.query.toLowerCase();
      queryMatch = [
        f.title.toLowerCase(),
        f.message.toLowerCase(),
        f.user?.name?.toLowerCase() || '',
        f.user?.email?.toLowerCase() || ''
      ].some(field => field.includes(query));
    }
    
    return typeMatch && statusMatch && queryMatch;
  });
})

const paginatedFeedback = computed(() => {
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  return filteredFeedback.value ? filteredFeedback.value.slice(start, end) : []
})

const totalPages = computed(() => {
  return Math.ceil(filteredFeedback.value.length / pageSize)
})

// Watch for filter changes and reset to first page
watch([() => filters.type, () => filters.status, () => filters.query], () => {
  page.value = 1
})

// Methods
function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    bug: 'red',
    feature: 'blue',
    idea: 'emerald',
    other: 'gray'
  }
  return colors[type] || 'gray'
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    open: 'amber',
    in_progress: 'blue',
    resolved: 'green'
  }
  return colors[status] || 'gray'
}

function formatStatus(status: string) {
  return status.replace('_', ' ')
}

function markResolved(feedbackItem: Feedback) {
  const index = feedback.value.findIndex(f => f.id === feedbackItem.id)
  if (index !== -1) {
    feedback.value[index].status = 'resolved'
  }
}

function viewDetails(feedbackItem: Feedback) {
  // Safely format user info
  const userInfo = feedbackItem.user 
    ? `User: ${feedbackItem.user.name} (${feedbackItem.user.email})\n`
    : 'User: Anonymous\n';
    
  // In a real app, this would open a modal or navigate to a detail view
  alert(`Feedback #${feedbackItem.id}\n\n` +
    `Title: ${feedbackItem.title || 'No title'}\n` +
    `Type: ${feedbackItem.type || 'Not specified'}\n` +
    `Status: ${formatStatus(feedbackItem.status)}\n` +
    `Rating: ${'★'.repeat(feedbackItem.rating || 0)}${'☆'.repeat(5 - (feedbackItem.rating || 0))}\n\n` +
    userInfo +
    `Message:\n${feedbackItem.message}\n\n` +
    `Submitted by: ${feedbackItem.user?.name} (${feedbackItem.user?.email})\n` +
    `Date: ${feedbackItem.createdAt}`)
}
</script>
