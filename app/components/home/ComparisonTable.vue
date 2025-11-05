<template>
  <section class="py-16 md:py-24 bg-white" id="compare" aria-labelledby="comparison-heading">
    <div class="container mx-auto px-4">
      <h2 id="comparison-heading" class="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
        Why LeaseDirector Outperforms Spreadsheets
      </h2>
      <p class="mt-4 text-center text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
        Stop struggling with error-prone spreadsheets. LeaseDirector automates invoices, 
        payments, and compliance — saving hours each month and scaling with your portfolio.
      </p>

      <!-- Responsive Comparison Table -->
      <div class="mt-12 overflow-x-auto" role="region" aria-label="Feature comparison table">
        <div class="bg-white/80 backdrop-blur border border-gray-200/70 rounded-2xl shadow-lg overflow-hidden" role="table" aria-label="Comparison between traditional spreadsheets and LeaseDirector">
          
          <!-- Table Header -->
          <div role="rowgroup" class="bg-gradient-to-r from-primary-50 to-gray-50">
            <div role="row" class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div role="columnheader" scope="col" class="px-4 py-3 font-semibold text-gray-700">
                <span class="sr-only">Feature</span>
              </div>
              <div role="columnheader" scope="col" class="px-4 py-3 font-semibold text-center text-slate-700">
                <span class="block text-sm font-normal text-slate-500">Traditional Approach</span>
                <span>Spreadsheets</span>
              </div>
              <div role="columnheader" scope="col" class="px-4 py-3 font-semibold text-center text-primary-700">
                <span class="block text-sm font-normal text-primary-500">Modern Solution</span>
                <span>LeaseDirector</span>
              </div>
            </div>
          </div>

          <!-- Table Body -->
          <div role="rowgroup">
            <div 
              v-for="(row, index) in comparisonData" 
              :key="index"
              role="row"
              class="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100"
              :class="{ 'bg-gray-50/50': index % 2 === 0 }"
            >
              <!-- Feature Name -->
              <div 
                role="rowheader" 
                scope="row"
                class="px-4 py-3 font-medium text-gray-800 border-b md:border-b-0"
                :id="'feature-' + kebabCase(row.feature)"
              >
                {{ row.feature }}
              </div>
              
              <!-- Spreadsheets Column -->
              <div 
                role="cell" 
                class="px-4 py-3 flex items-start" 
                :class="row.spreadsheetsClass || 'text-slate-600'"
                :aria-labelledby="'feature-' + kebabCase(row.feature) + ' spreadsheets-col'"
              >
                <span class="mr-2">{{ row.spreadsheetsBadge || '•' }}</span>
                <span>{{ row.spreadsheets }}</span>
              </div>
              
              <!-- LeaseDirector Column -->
              <div 
                role="cell" 
                class="px-4 py-3 flex items-start" 
                :class="row.leasedirectorClass || 'text-gray-700'"
                :aria-labelledby="'feature-' + kebabCase(row.feature) + ' leasedirector-col'"
              >
                <span class="mr-2">{{ row.leasedirectorBadge || '•' }}</span>
                <span>{{ row.leasedirector }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Helper function to convert text to kebab-case for IDs
const kebabCase = (str: string) => {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .trim();
};
const comparisonData = [
  {
    feature: 'Ease of Setup',
    spreadsheets: 'Quick to start with basic templates',
    leasedirector: 'Guided setup process with pre-built templates',
    spreadsheetsBadge: '✓',
    leasedirectorBadge: '✓',
    spreadsheetsClass: 'text-primary-500',
    leasedirectorClass: 'text-primary-500'
  },
  {
    feature: 'Customization',
    spreadsheets: 'Highly flexible and customizable',
    leasedirector: 'Pre-built with common use cases covered',
    spreadsheetsBadge: '✓',
    leasedirectorBadge: '✓',
    spreadsheetsClass: 'text-primary-500',
    leasedirectorClass: 'text-gray-700'
  },
  {
    feature: 'Automation',
    spreadsheets: 'Limited, requires complex formulas',
    leasedirector: 'Automated invoicing, reminders, and late fees',
    spreadsheetsBadge: '⚠',
    leasedirectorBadge: '✓',
    spreadsheetsClass: 'text-slate-500',
    leasedirectorClass: 'text-primary-500'
  },
  {
    feature: 'Data Organization',
    spreadsheets: 'Single view of all data',
    leasedirector: 'Structured, separated views for better organization',
    spreadsheetsBadge: '✓',
    leasedirectorBadge: '✓',
    spreadsheetsClass: 'text-gray-700',
    leasedirectorClass: 'text-gray-700'
  },
  {
    feature: 'Scalability',
    spreadsheets: 'Slows down with large datasets',
    leasedirector: 'Handles growing portfolios efficiently',
    spreadsheetsBadge: '⚠',
    leasedirectorBadge: '✓',
    spreadsheetsClass: 'text-slate-500',
    leasedirectorClass: 'text-primary-500'
  },
  {
    feature: 'Learning investment',
    spreadsheets: 'Familiar interface for most users, but advanced features require extra effort',
    leasedirector: 'New system to learn, designed for simplicity and clarity',
    spreadsheetsBadge: '✓',
    leasedirectorBadge: '💡',
    spreadsheetsClass: 'text-gray-700',
    leasedirectorClass: 'text-gray-700'
  },
  {
    feature: 'Cost',
    spreadsheets: 'Often already available',
    leasedirector: 'Small subscription fee unlocks advanced automation',
    spreadsheetsBadge: '✓',
    leasedirectorBadge: '💲',
    spreadsheetsClass: 'text-primary-500',
    leasedirectorClass: 'text-slate-500'
  },
  {
    feature: 'Support & Updates',
    spreadsheets: 'Community support, no dedicated updates',
    leasedirector: 'Regular updates and dedicated support',
    spreadsheetsBadge: 'ℹ️',
    leasedirectorBadge: '✓',
    spreadsheetsClass: 'text-slate-500',
    leasedirectorClass: 'text-primary-500'
  }
];
</script>
