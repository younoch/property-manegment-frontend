<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import type { KPI } from '~/types/dashboard';
import type { Property, PropertyStats } from '~/types/properties';
import { createProtectedApiClient } from '~/utils/api';
import KPICard from '~/components/dashboard/KPICard.vue';
import DashboardChart from '~/components/dashboard/DashboardChart.vue';
import DataTable from '~/components/dashboard/DataTable.vue';
type RangeValue = typeof ranges[number]['value'];

// META
definePageMeta({ middleware: ['auth'] });

// STORES & API
const userStore = useUserStore();
const api = createProtectedApiClient();
const user = computed(() => userStore.currentUser);

// STATE
const loading = ref(true);
const error = ref<string | null>(null);

const properties = ref<Property[]>([]);
const selectedProperty = ref<string | null>(null);

// Format properties for USelect component
const propertyOptions = computed(() => {
  return properties.value.map(property => ({
    label: property.name,
    value: property.id,
    disabled: false
  }));
});
const loadingStats = ref(false);
const propertyStats = ref<Partial<PropertyStats>>({});

const revenueData = ref<Array<Array<string | number>>>([['Month', 'Revenue', 'Expenses']]);
const occupancyData = ref<Array<Array<string | number>>>([
  ['Month', 'Occupancy Rate'],
]);

// KPIs
const kpis = ref<KPI[]>([
  { id: 'total_units', label: 'Total Units', value: 0, icon: 'i-heroicons-home' },
  { id: 'occupied_units', label: 'Occupied', value: 0, icon: 'i-heroicons-check-circle' },
  { id: 'total_expenses', label: 'Total Expenses', value: 0, icon: 'i-heroicons-wrench-screwdriver' },
  { id: 'total_revenue', label: 'Monthly Revenue', value: 0, icon: 'i-heroicons-currency-dollar' }
]);

// Activities
const recentActivities = ref([
  { id: 1, type: 'payment', description: 'Rent payment received', amount: 1200, date: '2023-06-15T10:30:00Z', status: 'completed', property: 'Sunset Villas #42' },
  { id: 2, type: 'maintenance', description: 'AC repair request', date: '2023-06-14T15:45:00Z', status: 'in-progress', property: 'Downtown Loft #12' },
  { id: 3, type: 'application', description: 'New tenant application', date: '2023-06-14T09:15:00Z', status: 'pending', property: 'Riverside Apartments #5' },
  { id: 4, type: 'inspection', description: 'Quarterly property inspection', date: '2023-06-13T14:20:00Z', status: 'scheduled', property: 'Mountain View Complex #8' }
]);

// CHART OPTIONS
const revenueChartOptions = {
  title: 'Revenue vs Expenses',
  curveType: 'function',
  legend: { position: 'top' },
  colors: ['#4ade80', '#f87171'],
  vAxis: { format: 'currency', title: 'Amount (BDT)' },
  hAxis: { title: 'Month' }
};

const occupancyChartOptions = {
  title: 'Occupancy Rate',
  curveType: 'function',
  legend: { position: 'none' },
  colors: ['#60a5fa'],
  vAxis: { format: '#%', minValue: 0, maxValue: 1, title: 'Occupancy Rate' },
  hAxis: { title: 'Month' }
};

// TABLE COLUMNS
const activityColumns = [
  { id: 'description', key: 'description', label: 'Activity', sortable: true },
  { id: 'property', key: 'property', label: 'Property', sortable: true },
  { id: 'date', key: 'date', label: 'Date', sortable: true },
  { id: 'status', key: 'status', label: 'Status', sortable: true }
];

// DATE RANGES
const ranges = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' }
] as const;


const selectedRange = ref<RangeValue>(ranges[2].value);
const currentStartDate = ref<Date>(new Date());
const currentEndDate = ref<Date>(new Date());

// HELPERS
const formatDateForApi = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const transformRevenueExpenses = (data: any): Array<Array<string | number>> => {
  const result: Array<Array<string | number>> = [['Month', 'Revenue', 'Expenses']];
  const revenueMap = new Map(data.monthlyRevenue.map((r: any) => [`${r.year}-${r.month}`, r]));
  const expenseMap = new Map(data.monthlyExpenses.map((e: any) => [`${e.year}-${e.month}`, e]));
  const allKeys = new Set<string>([...revenueMap.keys(), ...expenseMap.keys()]);

  const sortedKeys = Array.from(allKeys).sort((a, b) => {
    const [ayStr, amStr] = a.split('-');
    const [byStr, bmStr] = b.split('-');
    
    const ay = ayStr ? parseInt(ayStr, 10) : 0;
    const am = amStr ? parseInt(amStr, 10) : 0;
    const by = byStr ? parseInt(byStr, 10) : 0;
    const bm = bmStr ? parseInt(bmStr, 10) : 0;
    
    return ay === by ? am - bm : ay - by;
  });

  for (const key of sortedKeys) {
    const revenue = revenueMap.get(key);
    const expense = expenseMap.get(key);
    result.push([
      revenue?.label || expense?.label || '',
      revenue?.amount ?? 0,
      expense?.amount ?? 0
    ]);
  }
  return result;
};

const getDateRange = (range: string): { startDate: Date; endDate: Date } => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  switch (range) {
    case 'this_month':
      return { startDate: new Date(currentYear, currentMonth, 1), endDate: today };
    case 'last_month':
      return { startDate: new Date(currentYear, currentMonth - 1, 1), endDate: new Date(currentYear, currentMonth, 0) };
    case 'last_3_months':
      return { startDate: new Date(currentYear, currentMonth - 2, 1), endDate: today };
    case 'this_year':
      return { startDate: new Date(currentYear, 0, 1), endDate: today };
    case 'last_year':
      return { startDate: new Date(currentYear - 1, 0, 1), endDate: new Date(currentYear - 1, 11, 31) };
    case 'all_time':
      return { startDate: new Date(2024, 0, 1), endDate: today };
    default:
      return { startDate: new Date(currentYear, currentMonth - 2, 1), endDate: today };
  }
};

// API CALLS
const fetchProperties = async () => {
  loading.value = true;
  error.value = null;
  try {
    const portfolio = user.value?.owned_portfolios?.[0];
    if (!portfolio) throw new Error('No owned portfolios found for user');

    const response = await api.get<any>(`/portfolios/${portfolio.id}/properties`);
    const raw = response?.data?.data ?? response?.data ?? response;
    properties.value = Array.isArray(raw) ? raw : [];

    if (properties.value.length) {
      // @ts-ignore value
      selectedProperty.value = propertyOptions.value[0].value;
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to load properties';
    properties.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchPropertyStats = async (propertyId: string | null) => {
  if (!propertyId) {
    propertyStats.value = {};
    return;
  }
  loadingStats.value = true;
  try {
    const params = {
      startDate: formatDateForApi(currentStartDate.value),
      endDate: formatDateForApi(currentEndDate.value)
    };
    const response = await api.get(`/dashboard/properties/${propertyId}/stats?${new URLSearchParams(params)}`);
    propertyStats.value = response?.data ?? response;

    // @ts-ignore - We know these properties exist from the API response
    kpis.value[0].value = propertyStats.value.totalUnits;
    // @ts-ignore
    kpis.value[1].value = propertyStats.value.rentedUnits;
    // @ts-ignore
    kpis.value[2].value = propertyStats.value.totalExpenses;
    // @ts-ignore
    kpis.value[3].value = propertyStats.value.totalRevenue;

    revenueData.value = transformRevenueExpenses(propertyStats.value);
    occupancyData.value = occupancyData.value.concat(propertyStats.value.historicalOccupancy);
  } catch (e: any) {
    console.error('Failed to fetch property stats:', e);
    propertyStats.value = {};
  } finally {
    loadingStats.value = false;
  }
};
// WATCHERS
watch(selectedRange, async (newRange) => {
  if (!newRange) return;
  const { startDate, endDate } = getDateRange(newRange);
  currentStartDate.value = startDate;
  currentEndDate.value = endDate;
  if (selectedProperty.value) await fetchPropertyStats(selectedProperty.value);
}, { immediate: true });

watch(selectedProperty, (newPropertyId) => {
  fetchPropertyStats(newPropertyId);
});

watch(() => user.value, async (newUser, oldUser) => {
  if (newUser?.id === oldUser?.id) return;
  if (newUser?.owned_portfolios?.length) {
    await fetchProperties();
  } else if (newUser) {
    properties.value = [];
    error.value = 'No properties found for your account. Please contact support.';
  }
}, { immediate: true });

// METHODS
const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    create: 'green',
    update: 'blue',
    delete: 'red',
    login: 'indigo',
    logout: 'gray',
  };
  return colors[action.toLowerCase()] || 'gray';
};

const handlePropertyChange = (propertyId: string | null) => {
  selectedProperty.value = propertyId;
};

const handleRangeChange = (range: string) => {
  loadingStats.value = true;
  setTimeout(() => { loadingStats.value = false }, 500);
};

const handleRefresh = async () => {
  try {
    loading.value = true;
    loadingStats.value = true;
    error.value = null;
    await Promise.all([
      fetchProperties(),
      selectedProperty.value ? fetchPropertyStats(selectedProperty.value) : Promise.resolve()
    ]);
  } catch (e) {
    error.value = 'Failed to refresh data';
    console.error('Refresh error:', e);
  } finally {
    loading.value = false;
    loadingStats.value = false;
  }
};

// LIFECYCLE
onMounted(async () => {
  if (user.value?.owned_portfolios?.length) {
    await fetchProperties();
  } else {
    loading.value = false;
  }
});
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow w-full">
      <div class="w-full px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <div class="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto flex-wrap gap-2">
          <USelect 
            v-model="selectedProperty"
            :items="propertyOptions"
            size="sm"
            class="w-full sm:w-48 flex-shrink-0"
            placeholder="Select Property"
            :loading="loading"
            :disabled="loading"
            @update:modelValue="handlePropertyChange"
          />
          <USelect 
            v-model="selectedRange" 
            :items="ranges" 
            size="sm"
            class="w-full sm:w-48 flex-shrink-0"
            @update:modelValue="handleRangeChange"
          />
<UButton
            icon="i-heroicons-arrow-path"
            color="white"
            @click="handleRefresh"
            :loading="loading || loadingStats"
            class="flex-shrink-0"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full px-4 py-6 sm:px-6 lg:px-8">
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
      <div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 w-full">
        <KPICard 
          v-for="(kpi, index) in kpis" 
          :key="index"
          :kpi="{
            ...kpi,
            // Override values with API data if available
            value: propertyStats?.[kpi.id]?.current ?? kpi.value
          }"
          class="h-full"
          :class="{ 'opacity-50': loadingStats }"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 w-full">
        <!-- Revenue vs Expenses Chart -->
        <DashboardChart
          :show-chart="revenueData.length > 1"
          title="Revenue vs Expenses"
          :chart-data="revenueData"
          :chart-options="revenueChartOptions"
          :show-range-selector="false"
          class="h-[400px]"
        />
        <!-- Occupancy Rate Chart -->
        <DashboardChart
          :show-chart="occupancyData.length > 1"
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 w-full">
        <!-- Upcoming Due -->
        <UCard class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Recent Activity</h3>
              <UButton 
                size="xs" 
                variant="ghost" 
                color="primary"
                label="View All"
                trailing-icon="i-heroicons-arrow-right"
                disabled
              />
            </div>
          </template>
          <div class="text-center text-gray-500 py-8">
            <UIcon name="i-heroicons-information-circle" class="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p>Activity feed is currently unavailable</p>
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
          <div class="text-center text-gray-500 dark:text-gray-400 py-8">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p>No open maintenance requests</p>
          </div>
        </UCard>
      </div>
    </main>
  </div>
</template>
