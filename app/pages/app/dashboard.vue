<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useUserStore } from '~/stores/user';
import type { KPI } from '~/types/dashboard';
import type { Property, PropertyStats } from '~/types/properties';
import { createProtectedApiClient } from '~/utils/api';
import KPICard from '~/components/dashboard/KPICard.vue';
import DashboardChart from '~/components/dashboard/DashboardChart.vue';
import DataTable from '~/components/dashboard/DataTable.vue';
type RangeValue = 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'last_year' | 'all_time';
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

// Use loose typing for chart data to support Date objects and numbers
const revenueData = ref<any[]>([['Month', 'Revenue', 'Expenses']]);
const occupancyData = ref<any[]>([
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

// CHART OPTIONS - Updated for d3.js compatibility
const revenueChartOptions = {
  title: 'Revenue vs Expenses',
  colors: ['#4ade80', '#f87171'],
  vAxis: { 
    title: 'Amount (BDT)',
    gridlines: { count: 5 },
    format: 'currency'
  },
  hAxis: { 
    title: 'Month',
    gridlines: { count: 12 },
    format: 'MMM yyyy'
  },
  margin: { top: 30, right: 30, bottom: 80, left: 70 }
};

const occupancyChartOptions = {
  title: 'Occupancy Rate',
  colors: ['#60a5fa'],
  vAxis: { 
    title: 'Occupancy Rate',
    gridlines: { count: 5 },
    format: '#%',
    minValue: 0,
    maxValue: 1
  },
  hAxis: { 
    title: 'Month',
    gridlines: { count: 6 },
    format: 'MMM yyyy'
  },
  margin: { top: 30, right: 30, bottom: 80, left: 70 }
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

const transformRevenueExpenses = (data: any): any[] => {
  console.log('[DEBUG] transformRevenueExpenses input:', data);
  const result: any[] = [['Month', 'Revenue', 'Expenses']];
  
  if (!data?.monthlyRevenue || !data?.monthlyExpenses) {
    console.error('[ERROR] Missing required data in transformRevenueExpenses');
    return result;
  }
  
  const revenueMap = new Map<string, any>(data.monthlyRevenue.map((r: any) => {
    const key = `${r.year}-${r.month}`;
    console.log(`[DEBUG] Revenue item - Key: ${key}, Value:`, r);
    return [key, r];
  }));
  
  const expenseMap = new Map<string, any>(data.monthlyExpenses.map((e: any) => {
    const key = `${e.year}-${e.month}`;
    console.log(`[DEBUG] Expense item - Key: ${key}, Value:`, e);
    return [key, e];
  }));
  
  const allKeys = new Set<string>([...revenueMap.keys(), ...expenseMap.keys()]);
  console.log('[DEBUG] All unique month keys:', Array.from(allKeys));

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
    const revenue: any = revenueMap.get(key);
    const expense: any = expenseMap.get(key);

    // Prefer structured year/month from either revenue or expense entry
    const year = (revenue?.year ?? expense?.year) as number | undefined;
    const month = (revenue?.month ?? expense?.month) as number | undefined;

    let xValue: Date | null = null;
    if (typeof year === 'number' && typeof month === 'number') {
      // Google Charts Date: month is 0-based
      xValue = new Date(year, month - 1, 1);
    }

    // Fallback: if we somehow don't have year/month, skip this row
    if (!xValue) continue;

    result.push([
      xValue,
      revenue?.amount ?? 0,
      expense?.amount ?? 0
    ]);
  }
  return result;
};

const transformOccupancyHistory = (data: any): any[] => {
  const historical = Array.isArray(data?.historicalOccupancy)
    ? data.historicalOccupancy
    : [];

  const rows: any[] = [];

  for (const entry of historical) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const [label, value] = entry as [string, number];

    // Try to parse label like "Nov, 2025" into a Date
    const parsed = new Date(label);
    if (isNaN(parsed.getTime())) {
      continue;
    }

    rows.push([parsed, value]);
  }

  return [
    ['Month', 'Occupancy Rate'],
    ...rows
  ];
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
    console.log('[DEBUG] No property ID provided');
    propertyStats.value = {};
    return;
  }
  loadingStats.value = true;
  try {
    const params = {
      startDate: formatDateForApi(currentStartDate.value),
      endDate: formatDateForApi(currentEndDate.value)
    };
    console.log('[DEBUG] Fetching stats with params:', params);
    
    const response = await api.get(`/dashboard/properties/${propertyId}/stats?${new URLSearchParams(params)}`);
    console.log('[DEBUG] API raw response:', response);

    const stats = (response as any)?.data?.data ?? (response as any)?.data ?? response;
    console.log('[DEBUG] Normalized stats object:', stats);

    propertyStats.value = stats;
    console.log('[DEBUG] Updated propertyStats:', propertyStats.value);

    // Update KPIs from normalized stats
    // @ts-ignore - API guarantees these fields
    kpis.value[0].value = stats.totalUnits ?? 0;
    // @ts-ignore
    kpis.value[1].value = stats.rentedUnits ?? 0;
    // @ts-ignore
    kpis.value[2].value = stats.totalExpenses ?? 0;
    // @ts-ignore
    kpis.value[3].value = stats.totalRevenue ?? 0;

    // Build chart data for Revenue vs Expenses
    revenueData.value = transformRevenueExpenses(stats);

    // Build chart data for Occupancy Rate (Date-based x-axis)
    occupancyData.value = transformOccupancyHistory(stats);
    console.log('Preview occupancyData and ckecking the data type', occupancyData.value);
    console.log('Preview revenueData and checking the data type', revenueData.value);
    
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
  console.log('[DEBUG] Dashboard mounted, checking for user portfolios...');
  if (user.value?.owned_portfolios?.length) {
    console.log('[DEBUG] User has portfolios, fetching properties...');
    await fetchProperties();
    
    // Use nextTick to ensure the DOM is updated
    await nextTick();
    
    console.log('[DEBUG] Properties loaded, selected property:', selectedProperty.value);
    console.log('[DEBUG] Property options:', propertyOptions.value);
    
    // Force a refresh of the stats
    if (selectedProperty.value) {
      console.log('[DEBUG] Fetching stats for selected property...');
      fetchPropertyStats(selectedProperty.value);
    } else if (propertyOptions.value.length > 0 && propertyOptions.value[0]?.value) {
      console.log('[DEBUG] No property selected, selecting first property...');
      selectedProperty.value = propertyOptions.value[0].value;
      // Fetch stats after setting the property
      fetchPropertyStats(selectedProperty.value);
    } else {
      console.warn('[WARN] No properties available to select');
      loading.value = false;
    }
  } else {
    console.warn('[WARN] User has no owned portfolios');
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
          chart-type="bar"
          :chart-data="revenueData"
          :chart-options="revenueChartOptions"
          :show-range-selector="false"
          class="h-[400px]"
        />
        <!-- Occupancy Rate Chart -->
        <DashboardChart
          :show-chart="occupancyData.length > 1"
          title="Occupancy Rate"
          chart-type="line"
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
          view-all-route=""
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
                to="/app/maintenance"
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
