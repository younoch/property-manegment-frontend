<template>
  <section class="py-16 border-t border-gray-100">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center">What early users say</h2>
      <div class="mt-10 grid md:grid-cols-3 gap-6">
        <TestimonialCard
          name="Sadia R."
          role="Landlord, 6 units"
          quote="LeaseTrack cut my rent follow-up time in half. Invoices and late fees just work."
          avatar="https://picsum.photos/200/200?random=25"
        />
        <TestimonialCard
          name="Nafiz H."
          role="Property Manager"
          quote="The grace period logic and credits saved us from so many mistakes."
          avatar="https://picsum.photos/200/200?random=26"
        />
        <TestimonialCard
          name="Anika K."
          role="Owner, small portfolio"
          quote="Finally a tool that’s not overkill. Simple, fast, reliable."
          avatar="https://picsum.photos/200/200?random=27"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import TestimonialCard from '@/components/home/TestimonialCard.vue'
</script>

