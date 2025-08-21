<!-- <template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0 mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <ClientOnly>
        <template #default>
          <div class="px-4 py-6 sm:px-0">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Welcome back, {{ displayName }}!
                </h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    You are logged in as a
                    <span class="font-medium text-primary-600">
                      {{ userRole ? getRoleByValue(userRole)?.label : 'Unknown Role' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 px-4 sm:px-0">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <UCard>
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-home" class="h-8 w-8 text-primary-600" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Total Properties
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ stats.properties }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </UCard>

              <UCard>
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-users" class="h-8 w-8 text-green-600" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Active Tenants
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ stats.tenants }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </UCard>

              <UCard>
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UIcon name="i-heroicons-currency-dollar" class="h-8 w-8 text-yellow-600" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Monthly Revenue
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        ${{ stats.revenue.toLocaleString() }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </UCard>
            </div>
          </div>

          <div class="mt-8 px-4 sm:px-0">
            <UCard>
              <template #header>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
              </template>
              
              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(activity, index) in recentActivities" :key="activity.id" class="relative pb-8">
                    <div v-if="index !== recentActivities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    <div class="relative flex space-x-3">
                      <div>
                        <span class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                          <UIcon :name="activity.icon" class="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">
                            {{ activity.description }}
                          </p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          <time :datetime="activity.date">{{ formatDate(activity.date) }}</time>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </UCard>
          </div>
        </template>
        
        <template #fallback>
          <div class="px-4 py-6 sm:px-0">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="animate-pulse">
                  <div class="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 px-4 sm:px-0">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="animate-pulse">
                  <div class="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="animate-pulse">
                  <div class="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow p-6">
                <div class="animate-pulse">
                  <div class="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'nuxt/app'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'
import { USER_ROLES, getRoleByValue, getRoleColor, getRolePermissions } from '../constants/roles'

definePageMeta({
  middleware: 'auth'
});

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const currentUser = computed(() => userStore.currentUser);
const displayName = computed(() => userStore.displayName);
const userRole = computed(() => userStore.userRole);
const isAuthenticated = computed(() => userStore.isLoggedIn);

onMounted(async () => {
  if (!currentUser.value) {
    try {
      const result = await authStore.checkAuth(true);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
    }
  }
});

const stats = ref({
  properties: 12,
  tenants: 8,
  revenue: 15420
});

const recentActivities = ref([
  {
    id: 1,
    description: 'New tenant application submitted for Unit 3B',
    icon: 'i-heroicons-user-plus',
    date: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    description: 'Maintenance request completed for Unit 2A',
    icon: 'i-heroicons-wrench-screwdriver',
    date: '2024-01-14T15:30:00Z'
  },
  {
    id: 3,
    description: 'Rent payment received from Unit 1C',
    icon: 'i-heroicons-currency-dollar',
    date: '2024-01-14T09:15:00Z'
  },
  {
    id: 4,
    description: 'Property inspection scheduled for tomorrow',
    icon: 'i-heroicons-calendar',
    date: '2024-01-13T14:20:00Z'
  }
]);

watch(() => router.currentRoute.value.fullPath, () => {
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script> -->
<script setup lang="ts">
import GoogleChart from '../components/ui/GoogleChart.vue'

// ------- Controls -------
const ranges = ['This Month', 'Last 3 Months', 'Last 12 Months']
const selectedRange = ref(ranges[2])

// ------- KPI (mock) -------
const kpis = [
  { label: 'Vacant Units', value: 8, icon: 'i-heroicons-home', delta: -2, spark: [['M', 'v'], ['Jan', 12], ['Feb', 11], ['Mar', 9], ['Apr', 10], ['May', 8]] },
  { label: 'Active Leases', value: 126, icon: 'i-heroicons-document-text', delta: +5, spark: [['M', 'v'], ['Jan', 118], ['Feb', 119], ['Mar', 121], ['Apr', 124], ['May', 126]] },
  { label: 'Overdue Invoices', value: 12, icon: 'i-heroicons-exclamation-triangle', delta: +3, spark: [['M', 'v'], ['Jan', 7], ['Feb', 8], ['Mar', 9], ['Apr', 10], ['May', 12]] },
  { label: 'Overdue Amount', value: 185000, icon: 'i-heroicons-banknotes', delta: +15000, money: true, spark: [['M', 'v'], ['Jan', 130000], ['Feb', 140000], ['Mar', 150000], ['Apr', 170000], ['May', 185000]] },
  { label: 'Open Maintenance', value: 7, icon: 'i-heroicons-wrench', delta: -1, spark: [['M', 'v'], ['Jan', 9], ['Feb', 8], ['Mar', 8], ['Apr', 7], ['May', 7]] },
  { label: 'Payments This Month', value: 540000, icon: 'i-heroicons-arrow-trending-up', delta: +30000, money: true, spark: [['M', 'v'], ['Jan', 420000], ['Feb', 450000], ['Mar', 470000], ['Apr', 510000], ['May', 540000]] }
]

// ------- Charts (mock) -------
const incomeData = [
  ['Month', 'Income'],
  ['Sep 2024', 420000], ['Oct 2024', 450000], ['Nov 2024', 460000], ['Dec 2024', 480000],
  ['Jan 2025', 500000], ['Feb 2025', 520000], ['Mar 2025', 510000], ['Apr 2025', 535000],
  ['May 2025', 545000], ['Jun 2025', 560000], ['Jul 2025', 570000], ['Aug 2025', 590000]
]
const agingData = [
  ['Bucket', 'Outstanding'],
  ['0–30', 90000], ['31–60', 60000], ['61–90', 20000], ['90+', 15000]
]
const occupancyData = [
  ['Property', 'Occupied', 'Vacant'],
  ['Greenview', 18, 2], ['Lakehouse', 6, 1], ['City Center', 11, 3],
]
const maintenanceData = [
  ['Status', 'Count'],
  ['Open', 5], ['In Progress', 2], ['Completed', 11]
]

// ------- Brand Colors (analogous to Tailwind green-400 #4ade80) -------
const brandColors = ['#4ade80', '#34d399', '#a3e635', '#2dd4bf'] // green-400, emerald-400, lime-400, teal-400

// ------- Chart options (with brand colors) -------
const lineOpts = {
  curveType: 'function',
  legend: { position: 'bottom', textStyle: { color: '#374151' } }, // gray-700 labels
  chartArea: { left: 40, right: 16, top: 10, bottom: 36 },
  height: 320,
  colors: [brandColors[0]], // primary green
  vAxis: { format: 'short', gridlines: { color: '#EEF2FF' } }
}

const barOpts = {
  legend: { position: 'none' },
  chartArea: { left: 56, right: 16, top: 10, bottom: 36 },
  height: 320,
  colors: [brandColors[1]] // emerald
}

const stackedBarOpts = {
  isStacked: true,
  legend: { position: 'bottom', textStyle: { color: '#374151' } },
  chartArea: { left: 88, right: 16, top: 10, bottom: 36 },
  height: 320,
  colors: [brandColors[0], brandColors[2]] // green + lime
}

const donutOpts = {
  pieHole: 0.45,
  legend: { position: 'bottom', textStyle: { color: '#374151' } },
  chartArea: { left: 10, right: 10, top: 10, bottom: 36 },
  height: 320,
  colors: [brandColors[0], brandColors[1], brandColors[3]] // green, emerald, teal
}

// Sparkline options (minimal axes, tiny height)
const sparkOpts = {
  legend: 'none',
  chartArea: { width: '100%', height: '100%' },
  hAxis: { textPosition: 'none', gridlines: { count: 0 } },
  vAxis: { textPosition: 'none', gridlines: { count: 0 }, baselineColor: 'transparent' },
  lineWidth: 2,
  height: 56,
  colors: [brandColors[0]] // sparks use primary green
}

// ------- Tables (mock) -------
const upcomingDue = [
  { id: 'INV-1001', tenant: 'Rafi Khan', unit: 'A1', due: '2025-09-05', amount: 15000 },
  { id: 'INV-1002', tenant: 'S. Ahmed', unit: 'A2', due: '2025-09-07', amount: 15000 },
  { id: 'INV-1003', tenant: 'Priya Das', unit: 'B3', due: '2025-09-09', amount: 18000 }
]
const recentPayments = [
  { id: 'PAY-3001', tenant: 'Rafi Khan', method: 'bank_transfer', at: '2025-08-20T12:10:00Z', amount: 15000 },
  { id: 'PAY-3002', tenant: 'S. Ahmed', method: 'card', at: '2025-08-19T09:45:00Z', amount: 15000 },
  { id: 'PAY-3003', tenant: 'T. Rahman', method: 'cash', at: '2025-08-18T16:05:00Z', amount: 12000 }
]
const openMaintenance = [
  { id: 'MR-10', property: 'Greenview', unit: 'A2', title: 'Leaking sink', priority: 'high', created_at: '2025-08-18T09:00:00Z' },
  { id: 'MR-11', property: 'Lakehouse', unit: '1', title: 'AC not cooling', priority: 'medium', created_at: '2025-08-19T11:30:00Z' }
]
const expiringLeases = [
  { id: 'L-77', unit: 'B3', tenants: 'Priya Das', end_date: '2025-10-15' },
  { id: 'L-78', unit: 'C1', tenants: 'M. Islam', end_date: '2025-10-28' }
]

// ------- Helpers -------
const fmtBDT = (n: number) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(n)
const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(iso))
const kpiValue = (k: any) => (k.money ? fmtBDT(k.value) : k.value)
const deltaClass = (d: number) =>
  d >= 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Quick snapshot of your rentals and cash flow.</p>
      </div>
      <div class="flex items-center gap-2">
        <USelect v-model="selectedRange" :items="ranges" placeholder="Range" class="min-w-[180px]" />
        <UButton icon="i-heroicons-arrow-path">Refresh</UButton>
      </div>
    </div>

    <!-- KPI grid WITH gradient glass effect & sparkline -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
         v-for="k in kpis" :key="k.label"
         :ui="{ padding: { base: 'p-3' } }"
         class="relative overflow-hidden transition hover:translate-y-[-2px] hover:shadow-xl backdrop-blur
                border border-white/40 dark:border-white/10
                bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/5"
       >
        <!-- soft glow -->
        <div class="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary-500/20 blur-2xl"></div>

        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ k.label }}</div>
            <div class="mt-1 text-3xl font-semibold">{{ kpiValue(k) }}</div>
            <span
              class="inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded-full"
              :class="deltaClass(k.delta)"
              :title="k.delta >= 0 ? 'Up vs. last period' : 'Down vs. last period'"
            >
              <UIcon :name="k.delta >= 0 ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-right'" class="w-3.5 h-3.5" />
              <span>{{ k.delta >= 0 ? '+' : '' }}{{ k.money ? fmtBDT(Math.abs(k.delta)) : Math.abs(k.delta) }}</span>
            </span>
          </div>

          <div class="flex flex-col items-end">
            <div class="rounded-full p-2 bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <UIcon :name="k.icon" class="h-6 w-6" />
            </div>
            <!-- Sparkline -->
            <div class="mt-2 w-40 h-14">
              <GoogleChart
                v-if="k.spark"
                type="LineChart"
                :data="k.spark"
                :options="sparkOpts"
                wrapperClass="w-full h-full"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
             <UCard :ui="{ padding: { base: 'p-3' } }" class="lg:col-span-2 border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="flex items-center justify-between mb-2">
           <div class="text-sm font-medium">Income (Last 12 Months)</div>
           <UBadge color="primary" variant="soft">BDT</UBadge>
         </div>
         <GoogleChart type="LineChart" :data="incomeData" :options="lineOpts" wrapperClass="w-full h-[320px]" />
       </UCard>

             <UCard :ui="{ padding: { base: 'p-3' } }" class="border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="text-sm mb-2 font-medium">A/R Aging</div>
         <GoogleChart type="ColumnChart" :data="agingData" :options="barOpts" wrapperClass="w-full h-[320px]" />
       </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
             <UCard :ui="{ padding: { base: 'p-3' } }" class="lg:col-span-2 border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="text-sm mb-2 font-medium">Occupancy by Property</div>
         <GoogleChart type="BarChart" :data="occupancyData" :options="stackedBarOpts" wrapperClass="w-full h-[320px]" />
       </UCard>

             <UCard :ui="{ padding: { base: 'p-3' } }" class="border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="text-sm mb-2 font-medium">Maintenance Status</div>
         <GoogleChart type="PieChart" :data="maintenanceData" :options="donutOpts" wrapperClass="w-full h-[320px]" />
       </UCard>
    </div>

    <!-- Tables with soft styles -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
             <UCard :ui="{ padding: { base: 'p-3' } }" class="border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="flex items-center justify-between mb-2">
           <div class="text-sm font-medium">Upcoming Due (14 days)</div>
           <UButton variant="ghost" size="xs">View all</UButton>
         </div>
        <div class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
          <table class="w-full text-sm">
            <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <th class="py-2 px-3 text-left">Invoice</th>
                <th class="py-2 px-3 text-left">Tenant / Unit</th>
                <th class="py-2 px-3 text-left">Due</th>
                <th class="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
              <tr v-for="row in upcomingDue" :key="row.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
                <td class="py-2 px-3 font-medium">{{ row.id }}</td>
                <td class="py-2 px-3 text-gray-700 dark:text-gray-200">{{ row.tenant }} · {{ row.unit }}</td>
                <td class="py-2 px-3">{{ fmtDate(row.due) }}</td>
                <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(row.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

             <UCard :ui="{ padding: { base: 'p-3' } }" class="border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="flex items-center justify-between mb-2">
           <div class="text-sm font-medium">Recent Payments</div>
           <UButton variant="ghost" size="xs">View all</UButton>
         </div>
        <div class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
          <table class="w-full text-sm">
            <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <th class="py-2 px-3 text-left">Payment</th>
                <th class="py-2 px-3 text-left">Tenant</th>
                <th class="py-2 px-3 text-left">Method</th>
                <th class="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
              <tr v-for="row in recentPayments" :key="row.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
                <td class="py-2 px-3 font-medium">{{ row.id }}</td>
                <td class="py-2 px-3 text-gray-700 dark:text-gray-200">{{ row.tenant }}</td>
                <td class="py-2 px-3 capitalize">{{ row.method.replace('_',' ') }}</td>
                <td class="py-2 px-3 text-right font-medium">{{ fmtBDT(row.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
             <UCard :ui="{ padding: { base: 'p-3' } }" class="border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="flex items-center justify-between mb-2">
           <div class="text-sm font-medium">Open Maintenance</div>
           <UButton variant="ghost" size="xs">View all</UButton>
         </div>
        <div class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
          <table class="w-full text-sm">
            <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <th class="py-2 px-3 text-left">Ticket</th>
                <th class="py-2 px-3 text-left">Property / Unit</th>
                <th class="py-2 px-3 text-left">Title</th>
                <th class="py-2 px-3 text-left">Priority</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
              <tr v-for="row in openMaintenance" :key="row.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
                <td class="py-2 px-3 font-medium">{{ row.id }}</td>
                <td class="py-2 px-3">{{ row.property }} · {{ row.unit }}</td>
                <td class="py-2 px-3">{{ row.title }}</td>
                <td class="py-2 px-3">
                  <span
                    class="inline-flex items-center rounded px-2 py-0.5 text-xs ring-1"
                    :class="{
                      'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-800/40': row.priority==='high',
                      'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800/40': row.priority==='medium',
                      'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-white/10 dark:text-gray-200 dark:ring-white/10': row.priority==='low'
                    }"
                  >
                    {{ row.priority }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

             <UCard :ui="{ padding: { base: 'p-3' } }" class="border border-white/40 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-white/5">
         <div class="flex items-center justify-between mb-2">
           <div class="text-sm font-medium">Expiring Leases (Next 60 days)</div>
           <UButton variant="ghost" size="xs">View all</UButton>
         </div>
        <div class="overflow-hidden rounded-md ring-1 ring-black/5 dark:ring-white/10">
          <table class="w-full text-sm">
            <thead class="bg-gray-50/70 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              <tr>
                <th class="py-2 px-3 text-left">Lease</th>
                <th class="py-2 px-3 text-left">Unit</th>
                <th class="py-2 px-3 text-left">Tenant(s)</th>
                <th class="py-2 px-3 text-left">Ends</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 dark:divide-white/10">
              <tr v-for="row in expiringLeases" :key="row.id" class="hover:bg-gray-50/60 dark:hover:bg-white/5 transition">
                <td class="py-2 px-3 font-medium">{{ row.id }}</td>
                <td class="py-2 px-3">{{ row.unit }}</td>
                <td class="py-2 px-3">{{ row.tenants }}</td>
                <td class="py-2 px-3">{{ fmtDate(row.end_date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </div>
</template>


