<template>
  <section class="bg-gray-50 py-16" id="compare" aria-labelledby="comparison-heading">
    <div class="container mx-auto px-4">
      <!-- Heading -->
      <h2 id="comparison-heading" class="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
        Why LeaseDirector Outperforms Spreadsheets
      </h2>
      <p class="mt-4 text-center text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
        Stop struggling with error-prone spreadsheets. LeaseDirector automates invoices, payments, and compliance —
        saving hours each month and scaling with your portfolio.
      </p>

      <!-- Desktop Table -->
      <div class="hidden md:block mt-12 overflow-x-auto">
        <table class="min-w-full table-fixed bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <thead class="bg-gradient-to-r from-primary-50 to-gray-50">
            <tr>
              <th class="w-1/3 px-6 py-3 text-left text-gray-700 font-medium">Feature</th>
              <th class="w-1/3 px-6 py-3 text-gray-500 font-normal">Spreadsheets</th>
              <th class="w-1/3 px-6 py-3 text-primary-700 font-medium">LeaseDirector</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in comparisonData" :key="index"
              :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
              <th class="px-6 py-4 text-left text-gray-800 font-medium">{{ row.feature }}</th>

              <!-- Spreadsheets column -->
              <td class="px-6 py-4 text-left text-gray-700">
                <span class="inline-block mr-2">{{ row.spreadsheetsBadge || '•' }}</span>
                <span>{{ row.spreadsheets }}</span>
              </td>

              <!-- LeaseDirector column -->
              <td class="px-6 py-4 text-left text-gray-800">
                <span class="inline-block mr-2">{{ row.leasedirectorBadge || '•' }}</span>
                <span>{{ row.leasedirector }}</span>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden mt-12 space-y-4">
        <div v-for="(row, index) in comparisonData" :key="index" class="bg-white shadow rounded-2xl p-4">
          <h3 class="text-gray-800 font-semibold mb-3">{{ row.feature }}</h3>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-500 mb-1">Spreadsheets</span>
              <div class="flex items-start gap-2">
                <span class="text-primary-500">{{ row.spreadsheetsBadge || '•' }}</span>
                <span class="text-gray-700">{{ row.spreadsheets }}</span>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-medium text-primary-700 mb-1">LeaseDirector</span>
              <div class="flex items-start gap-2">
                <span class="text-primary-500">{{ row.leasedirectorBadge || '•' }}</span>
                <span class="text-gray-800">{{ row.leasedirector }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const comparisonData = [
  { 
    feature: 'Ease of Setup', 
    spreadsheets: 'Quick to start with basic templates', 
    leasedirector: 'Guided setup with AI suggestions for optimal templates', 
    spreadsheetsBadge: '✓', 
    leasedirectorBadge: '🤖' 
  },
  { 
    feature: 'Customization', 
    spreadsheets: 'Highly flexible but manual setup', 
    leasedirector: 'Pre-built AI-assisted templates cover common use cases', 
    spreadsheetsBadge: '✓', 
    leasedirectorBadge: '🤖' 
  },
  { 
    feature: 'Automation', 
    spreadsheets: 'Limited, requires complex formulas', 
    leasedirector: 'Automated invoicing, reminders, late fees, and AI-based insights', 
    spreadsheetsBadge: '⚠', 
    leasedirectorBadge: '🤖' 
  },
  { 
    feature: 'Data Organization', 
    spreadsheets: 'Single view of all data', 
    leasedirector: 'Structured, AI-suggested dashboards for better organization', 
    spreadsheetsBadge: '✓', 
    leasedirectorBadge: '🤖' 
  },
  { 
    feature: 'Scalability', 
    spreadsheets: 'Slows down with large datasets', 
    leasedirector: 'Handles growing portfolios efficiently with AI optimization', 
    spreadsheetsBadge: '⚠', 
    leasedirectorBadge: '🤖' 
  },
  { 
    feature: 'Learning Curve', 
    spreadsheets: 'Familiar interface but advanced features need manual effort', 
    leasedirector: 'New system designed for simplicity, AI guides learning', 
    spreadsheetsBadge: '✓', 
    leasedirectorBadge: '💡' 
  },
  { 
    feature: 'Cost', 
    spreadsheets: 'Often already available', 
    leasedirector: 'Small subscription fee unlocks AI-powered automation', 
    spreadsheetsBadge: '✓', 
    leasedirectorBadge: '💲' 
  },
  { 
    feature: 'Support & Updates', 
    spreadsheets: 'Community support, no dedicated updates', 
    leasedirector: 'Regular updates and AI-assisted support', 
    spreadsheetsBadge: 'ℹ️', 
    leasedirectorBadge: '🤖' 
  }
];

</script>
