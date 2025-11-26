<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useUserStore } from '~/stores/user';
import type { KPI } from '~/types/dashboard';
import type { Property, PropertyStats } from '~/types/properties';
import { createProtectedApiClient } from '~/utils/api';
import KPICard from '~/components/dashboard/KPICard.vue';
import DataTable from '~/components/dashboard/DataTable.vue';
import RevenueExpensesChart from '~/components/dashboard/RevenueExpensesChart.vue';
import OccupancyRateChart from '~/components/dashboard/OccupancyRateChart.vue';
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
interface MonthlyData {
  year: number;
  month: number;
  amount: number;
  label: string;
}

interface DashboardStats {
  totalUnits?: number;
  rentedUnits?: number;
  activeTenants?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  overduePayments?: any[];
  activeLeases?: number;
  occupancyRate?: number;
  monthlyRevenue: MonthlyData[];
  monthlyExpenses: MonthlyData[];
  historicalOccupancy: Array<[string, number]>;
}

const propertyStats = ref<Partial<DashboardStats>>({
  monthlyRevenue: [],
  monthlyExpenses: [],
  historicalOccupancy: []
});

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

// Recent Payments
interface Payment {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  reference?: string;
  notes?: string;
  invoice: {
    invoice_number: string;
    lease_id: string;
  };
}

const recentPayments = ref<Payment[]>([]);
const loadingPayments = ref(false);

// Fetch recent payments
const fetchRecentPayments = async (propertyId: string | null) => {
  if (!propertyId) return;
  
  loadingPayments.value = true;
  try {
    const queryParams = new URLSearchParams({
      page: '1',
      limit: '5',
      sortOrder: 'DESC'
    }).toString();
    
    const response = await api.get(`/payments/property/${propertyId}?${queryParams}`);
    
    if (response.success && response.data) {
      // Extract the data array from the response
      const responseData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Transform the data to match the DataTable's expected structure
      recentPayments.value = responseData.map(payment => ({
        id: payment.id,
        invoice_number: payment.invoice?.invoice_number || 'N/A',
        amount: payment.amount,
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
        status: payment.status,
        reference: payment.reference || '',
        _raw: payment // Keep the original data in case it's needed
      }));
    }
  } catch (err) {
    console.error('Error fetching recent payments:', err);
    error.value = 'Failed to load recent payments';
  } finally {
    loadingPayments.value = false;
  }
};

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
const paymentColumns = [
  { id: 'invoice_number', key: 'invoice_number', label: 'Invoice #', sortable: true, width: '20%' },
  { id: 'amount', key: 'amount', label: 'Amount', sortable: true, width: '20%' },
  { id: 'payment_method', key: 'payment_method', label: 'Method', sortable: true, width: '15%' },
  { id: 'payment_date', key: 'payment_date', label: 'Date', sortable: true, width: '25%' },
  { id: 'status', key: 'status', label: 'Status', sortable: true, width: '20%' }
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
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateForApi = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const transformRevenueExpenses = (data: any): any[] => {
  const result: any[] = [['Month', 'Revenue', 'Expenses']];
  
  if (!data?.monthlyRevenue || !data?.monthlyExpenses) {
    console.error('[ERROR] Missing required data in transformRevenueExpenses');
    return result;
  }
  
  const revenueMap = new Map<string, any>(data.monthlyRevenue.map((r: any) => {
    const key = `${r.year}-${r.month}`;
    return [key, r];
  }));
  
  const expenseMap = new Map<string, any>(data.monthlyExpenses.map((e: any) => {
    const key = `${e.year}-${e.month}`;
    return [key, e];
  }));
  
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

const transformOccupancyHistory = (data: any): Array<{ label: string; value: number }> => {
  const result = [];
  
  // Add current month's data if available
  if (data?.occupancyRate !== undefined) {
    const currentDate = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    result.push({
      label,
      value: data.occupancyRate * 100 // Convert to percentage
    });
  }

  // Add historical data if available
  if (Array.isArray(data?.historicalOccupancy)) {
    data.historicalOccupancy.forEach((entry: any) => {
      if (Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'string' && typeof entry[1] === 'number') {
        result.push({
          label: entry[0],
          value: entry[1] * 100 // Convert to percentage
        });
      }
    });
  }

  // Ensure we have at least one data point
  if (result.length === 0) {
    result.push({
      label: 'No Data',
      value: 0
    });
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

    const stats = (response as any)?.data?.data ?? (response as any)?.data ?? response;

    propertyStats.value = stats;

    // Update KPIs from normalized stats with nullish coalescing
    kpis.value[0].value = stats?.totalUnits ?? 0;
    kpis.value[1].value = stats?.rentedUnits ?? 0;
    kpis.value[2].value = stats?.totalExpenses ?? 0;
    kpis.value[3].value = stats?.totalRevenue ?? 0;

    // Build chart data for Occupancy Rate (Date-based x-axis)
    occupancyData.value = transformOccupancyHistory(stats);
    
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

const handlePropertyChange = async (propertyId: string | null) => {
  selectedProperty.value = propertyId;
  if (propertyId) {
    await fetchRecentPayments(propertyId);
  }
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
    
    // Use nextTick to ensure the DOM is updated
    await nextTick();
    
    // Force a refresh of the stats and fetch payments
    if (selectedProperty.value) {
      await Promise.all([
        fetchPropertyStats(selectedProperty.value),
        fetchRecentPayments(selectedProperty.value)
      ]);
    } else if (propertyOptions.value.length > 0 && propertyOptions.value[0]?.value) {
      selectedProperty.value = propertyOptions.value[0].value;
      // Fetch stats and payments after setting the property
      await Promise.all([
        fetchPropertyStats(selectedProperty.value),
        fetchRecentPayments(selectedProperty.value)
      ]);
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
        <RevenueExpensesChart
          :monthly-revenue="propertyStats?.monthlyRevenue || []"
          :monthly-expenses="propertyStats?.monthlyExpenses || []"
          class="h-[400px]"
        />
        <!-- Occupancy Rate Chart -->
        <OccupancyRateChart
          :occupancy-data="occupancyData"
          :occupancy-chart-options="occupancyChartOptions"
          class="h-[400px]"
        />
      </div>

      <!-- Recent Payments -->
      <div class="mb-8">
        <DataTable
          title="Recent Payments"
          :columns="paymentColumns"
          :items="recentPayments"
          :loading="loadingPayments"
          show-view-all
          view-all-route="/app/payments"
        >
          <template #invoice_number="{ value }">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ value }}
            </div>
          </template>
          <template #amount="{ value }">
            <div class="text-sm text-gray-900 dark:text-gray-100">
              {{ formatCurrency(value) }}
            </div>
          </template>
          <template #payment_method="{ value }">
            <div class="text-sm text-gray-900 dark:text-gray-100 capitalize">
              {{ value.replace('_', ' ') }}
            </div>
          </template>
          <template #payment_date="{ value }">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(value) }}
            </div>
          </template>
          <template #status="{ value }">
            <UBadge 
              :color="value === 'succeeded' ? 'green' : 'red'"
              variant="subtle"
              size="xs"
              class="capitalize"
            >
              {{ value }}
            </UBadge>
          </template>
        </DataTable>
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
