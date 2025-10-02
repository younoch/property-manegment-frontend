<template>
  <section class="py-16 md:py-24 bg-white" id="compare">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
        Why LeaseTrack Outperforms Spreadsheets
      </h2>
      <p class="mt-4 text-center text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
        Stop struggling with error-prone spreadsheets. LeaseTrack automates invoices, 
        payments, and compliance — saving hours each month and scaling with your portfolio.
      </p>

      <!-- Responsive Comparison Table -->
      <div class="mt-12 overflow-x-auto">
        <div class="bg-white/80 backdrop-blur border border-gray-200/70 rounded-2xl shadow-lg overflow-hidden">
          
          <!-- Table Header -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 bg-gradient-to-r from-primary-50 to-gray-50">
            <div class="px-4 py-3 font-semibold text-gray-700">Feature</div>
            <div class="px-4 py-3 font-semibold text-center text-slate-700">
              <span class="block text-sm font-normal text-slate-500">Traditional Approach</span>
              Spreadsheets
            </div>
            <div class="px-4 py-3 font-semibold text-center text-primary-700">
              <span class="block text-sm font-normal text-primary-500">Modern Solution</span>
              LeaseTrack
            </div>
          </div>

          <!-- Table Rows -->
          <div v-for="(row, index) in comparisonData" :key="index"
              class="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100"
              :class="{ 'bg-gray-50/50': index % 2 === 0 }">
            
            <!-- Feature Name -->
            <div class="px-4 py-3 font-medium text-gray-800 border-b md:border-b-0">
              {{ row.feature }}
            </div>
            
            <!-- Spreadsheets Column -->
            <div class="px-4 py-3 flex items-start" :class="row.spreadsheetsClass || 'text-slate-600'">
              <span class="mr-2">{{ row.spreadsheetsBadge || '•' }}</span>
              <span>{{ row.spreadsheets }}</span>
            </div>
            
            <!-- LeaseTrack Column -->
            <div class="px-4 py-3 flex items-start" :class="row.leasetrackClass || 'text-gray-700'">
              <span class="mr-2">{{ row.leasetrackBadge || '•' }}</span>
              <span>{{ row.leasetrack }}</span>
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
    leasetrack: 'Guided setup process with pre-built templates',
    spreadsheetsBadge: '✓',
    leasetrackBadge: '✓',
    spreadsheetsClass: 'text-primary-500',
    leasetrackClass: 'text-primary-500'
  },
  {
    feature: 'Customization',
    spreadsheets: 'Highly flexible and customizable',
    leasetrack: 'Pre-built with common use cases covered',
    spreadsheetsBadge: '✓',
    leasetrackBadge: '✓',
    spreadsheetsClass: 'text-primary-500',
    leasetrackClass: 'text-gray-700'
  },
  {
    feature: 'Automation',
    spreadsheets: 'Limited, requires complex formulas',
    leasetrack: 'Automated invoicing, reminders, and late fees',
    spreadsheetsBadge: '⚠',
    leasetrackBadge: '✓',
    spreadsheetsClass: 'text-slate-500',
    leasetrackClass: 'text-primary-500'
  },
  {
    feature: 'Data Organization',
    spreadsheets: 'Single view of all data',
    leasetrack: 'Structured, separated views for better organization',
    spreadsheetsBadge: '✓',
    leasetrackBadge: '✓',
    spreadsheetsClass: 'text-gray-700',
    leasetrackClass: 'text-gray-700'
  },
  {
    feature: 'Scalability',
    spreadsheets: 'Slows down with large datasets',
    leasetrack: 'Handles growing portfolios efficiently',
    spreadsheetsBadge: '⚠',
    leasetrackBadge: '✓',
    spreadsheetsClass: 'text-slate-500',
    leasetrackClass: 'text-primary-500'
  },
  {
    feature: 'Learning investment',
    spreadsheets: 'Familiar interface for most users, but advanced features require extra effort',
    leasetrack: 'New system to learn, designed for simplicity and clarity',
    spreadsheetsBadge: '✓',
    leasetrackBadge: '💡',
    spreadsheetsClass: 'text-gray-700',
    leasetrackClass: 'text-gray-700'
  },
  {
    feature: 'Cost',
    spreadsheets: 'Often already available',
    leasetrack: 'Small subscription fee unlocks advanced automation',
    spreadsheetsBadge: '✓',
    leasetrackBadge: '💲',
    spreadsheetsClass: 'text-primary-500',
    leasetrackClass: 'text-slate-500'
  },
  {
    feature: 'Support & Updates',
    spreadsheets: 'Community support, no dedicated updates',
    leasetrack: 'Regular updates and dedicated support',
    spreadsheetsBadge: 'ℹ️',
    leasetrackBadge: '✓',
    spreadsheetsClass: 'text-slate-500',
    leasetrackClass: 'text-primary-500'
  }
];
</script>
