<template>
  <section class="py-16" id="compare">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center">Why LeaseTrack beats spreadsheets</h2>
      <div class="mt-10 overflow-x-auto">
        <table class="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th class="text-left px-4 py-2">Capability</th>
              <th class="text-left px-4 py-2">Spreadsheets</th>
              <th class="text-left px-4 py-2">LeaseTrack</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
              <td class="px-4 py-3">Automatic monthly invoices</td>
              <td class="px-4 py-3">Manual setup & error-prone</td>
              <td class="px-4 py-3">One click / scheduled per lease</td>
            </tr>
            <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
              <td class="px-4 py-3">Grace & late fees</td>
              <td class="px-4 py-3">Hard to manage dates</td>
              <td class="px-4 py-3">TZ-aware overdue + idempotent fees</td>
            </tr>
            <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
              <td class="px-4 py-3">Partial payments & credits</td>
              <td class="px-4 py-3">Complex formulas</td>
              <td class="px-4 py-3">Built-in FIFO + credit carry-forward</td>
            </tr>
            <tr class="bg-white/80 backdrop-blur border border-gray-200 rounded-xl">
              <td class="px-4 py-3">Audit trail</td>
              <td class="px-4 py-3">None</td>
              <td class="px-4 py-3">Automatic history & exports</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
