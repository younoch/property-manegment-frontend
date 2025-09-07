<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { KPI } from '~/types/dashboard';

// Components
import KPICard from '~/components/dashboard/KPICard.vue';
import DashboardChart from '~/components/dashboard/DashboardChart.vue';
import DataTable from '~/components/dashboard/DataTable.vue';

definePageMeta({ middleware: ['auth'] })

// Router
const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(true);
const error = ref<string | null>(null);

// Date Ranges
const ranges = ['This Month', 'Last 3 Months', 'Last 12 Months'];
const selectedRange = ref(ranges[2]);

// Table columns for recent activities
const activityColumns = [
  { id: 'description', key: 'description', label: 'Activity', sortable: true },
  { id: 'property', key: 'property', label: 'Property', sortable: true },
  { id: 'date', key: 'date', label: 'Date', sortable: true },
  { id: 'status', key: 'status', label: 'Status', sortable: true }
];

// KPIs
const kpis = ref<KPI[]>([
  { 
    label: 'Total Properties', 
    value: 42, 
    icon: 'i-heroicons-home', 
    delta: 2,
    spark: [
      ['M', 'v'], 
      ['Jan', 35], ['Feb', 37], ['Mar', 39], 
      ['Apr', 40], ['May', 42]
    ] 
  },
  { 
    label: 'Active Tenants', 
    value: 126, 
    icon: 'i-heroicons-users', 
    delta: 5,
    spark: [
      ['M', 'v'], 
      ['Jan', 118], ['Feb', 119], ['Mar', 121], 
      ['Apr', 124], ['May', 126]
    ]
  },
  { 
    label: 'Vacancy Rate', 
    value: 8, 
    icon: 'i-heroicons-home-modern', 
    delta: -2,
    spark: [
      ['M', 'v'], 
      ['Jan', 12], ['Feb', 11], ['Mar', 9], 
      ['Apr', 8], ['May', 8]
    ]
  },
  { 
    label: 'Monthly Revenue', 
    value: 185000, 
    icon: 'i-heroicons-currency-dollar', 
    delta: 15000,
    money: true,
    spark: [
      ['M', 'v'], 
      ['Jan', 130000], ['Feb', 140000], ['Mar', 150000], 
      ['Apr', 170000], ['May', 185000]
    ]
  }
]);

// Chart Data
const revenueData = ref<Array<Array<string | number>>>([
  ['Month', 'Revenue', 'Expenses'],
  ['Jan', 130000, 90000],
  ['Feb', 140000, 95000],
  ['Mar', 150000, 100000],
  ['Apr', 170000, 105000],
  ['May', 185000, 110000]
]);

const occupancyData = ref<Array<Array<string | number>>>([
  ['Month', 'Occupancy Rate'],
  ['Jan', 0.72],
  ['Feb', 0.75],
  ['Mar', 0.78],
  ['Apr', 0.81],
  ['May', 0.84]
]);

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    type: 'payment',
    description: 'Rent payment received',
    amount: 1200,
    date: '2023-06-15T10:30:00Z',
    status: 'completed',
    property: 'Sunset Villas #42'
  },
  {
    id: 2,
    type: 'maintenance',
    description: 'AC repair request',
    date: '2023-06-14T15:45:00Z',
    status: 'in-progress',
    property: 'Downtown Loft #12'
  },
  {
    id: 3,
    type: 'application',
    description: 'New tenant application',
    date: '2023-06-14T09:15:00Z',
    status: 'pending',
    property: 'Riverside Apartments #5'
  },
  {
    id: 4,
    type: 'inspection',
    description: 'Quarterly property inspection',
    date: '2023-06-13T14:20:00Z',
    status: 'scheduled',
    property: 'Mountain View Complex #8'
  }
]);

// Chart Options
const revenueChartOptions = {
  title: 'Revenue vs Expenses',
  curveType: 'function',
  legend: { position: 'top' },
  colors: ['#4ade80', '#f87171'],
  vAxis: {
    format: 'currency',
    title: 'Amount (BDT)'
  },
  hAxis: {
    title: 'Month'
  }
};

const occupancyChartOptions = {
  title: 'Occupancy Rate',
  curveType: 'function',
  legend: { position: 'none' },
  colors: ['#60a5fa'],
  vAxis: {
    format: '#%',
    minValue: 0,
    maxValue: 1,
    title: 'Occupancy Rate'
  },
  hAxis: {
    title: 'Month'
  }
};

// Methods
const handleRangeChange = (range: string) => {
  loading.value = true;
  // In a real app, fetch data based on the selected range
  console.log('Selected range:', range);
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const handleRefresh = async () => {
  try {
    loading.value = true;
    error.value = null;
    // In a real app, refetch data here
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (err) {
    error.value = 'Failed to refresh data';
    console.error('Refresh error:', err);
  } finally {
    loading.value = false;
  }
};

// Format BDT currency
const fmtBDT = (value: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format date
const fmtDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Lifecycle Hooks
onMounted(async () => {
  try {
    loading.value = true;
    // In a real app, fetch initial data here
    await new Promise(resolve => setTimeout(resolve, 1000));
    loading.value = false;
  } catch (err) {
    error.value = 'Failed to load dashboard data';
    loading.value = false;
    console.error('Dashboard data error:', err);
  }
});
</script>
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <div class="flex items-center space-x-4">
          <USelect 
            v-model="selectedRange" 
            :items="ranges" 
            size="sm"
            class="w-48"
            @update:modelValue="handleRangeChange"
          />
          <UButton
            icon="i-heroicons-arrow-path"
            color="white"
            @click="handleRefresh"
            :loading="loading"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Error Alert -->
      <UAlert
        v-if="error"
        color="red"
        variant="solid"
        icon="i-heroicons-exclamation-circle"
        :title="error"
        class="mb-6"
      />

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPICard 
          v-for="(kpi, index) in kpis" 
          :key="index"
          :kpi="kpi"
          class="h-full"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Revenue vs Expenses Chart -->
        <DashboardChart
          title="Revenue vs Expenses"
          :chart-data="revenueData"
          :chart-options="revenueChartOptions"
          :show-range-selector="false"
          class="h-[400px]"
        />

        <!-- Occupancy Rate Chart -->
        <DashboardChart
          title="Occupancy Rate"
          :chart-data="occupancyData"
          :chart-options="occupancyChartOptions"
          :show-range-selector="false"
          class="h-[400px]"
        />
      </div>

      <!-- Recent Activities -->
      <div class="mb-8">
        <DataTable
          title="Recent Activities"
          :columns="activityColumns"
          :items="recentActivities"
          :loading="loading"
          show-view-all
          view-all-route="/activities"
        />
      </div>

      <!-- Additional Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Upcoming Due -->
        <UCard class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Upcoming Due (14 days)</h3>
              <UButton 
                variant="ghost" 
                size="sm"
                label="View All"
                to="/payments/upcoming"
                trailing-icon="i-heroicons-arrow-right"
              />
            </div>
          </template>
          <!-- Upcoming due content will go here -->
          <div class="text-center text-gray-500 dark:text-gray-400 py-8">
            <UIcon name="i-heroicons-calendar" class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p>No upcoming payments due</p>
          </div>
        </UCard>

        <!-- Open Maintenance -->
        <UCard class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Open Maintenance</h3>
              <UButton 
                variant="ghost" 
                size="sm"
                label="View All"
                to="/maintenance"
                trailing-icon="i-heroicons-arrow-right"
              />
            </div>
          </template>
          <!-- Open maintenance content will go here -->
          <div class="text-center text-gray-500 dark:text-gray-400 py-8">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p>No open maintenance requests</p>
          </div>
        </UCard>
      </div>
    </main>
  </div>
</template>
