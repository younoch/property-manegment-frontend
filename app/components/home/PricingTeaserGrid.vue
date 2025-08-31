<template>
  <section id="pricing" class="py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center">Simple pricing for growing portfolios</h2>
      <p class="mt-3 text-center text-gray-600">All plans include secure hosting and backups. Cancel anytime.</p>

      <div class="mt-10 grid lg:grid-cols-3 gap-6">
        <PricingTeaserCard
          title="Starter"
          price="$0"
          :features="[
            'Up to 2 units',
            'Unlimited leases & invoices',
            'Record payments & partials',
            'Portfolio timezone support',
            'Email support (48h)'
          ]"
          cta-text="Get Started"
          cta-to="/auth/register"
        />
        <PricingTeaserCard
          title="Pro"
          price="$9"
          :features="[
            'Up to 20 units',
            'Auto late fees & grace logic',
            'Credit/overpayment handling',
            'A/R aging & CSV export',
            'Priority email support (24h)'
          ]"
          cta-text="Upgrade to Pro"
          cta-to="/signup"
          highlight
        />
        <PricingTeaserCard
          title="Business"
          price="$29"
          :features="[
            'Unlimited units',
            'Multi-portfolio roles & permissions',
            'Advanced reports & audit logs',
            'SLA support (8h)',
            'Early access features'
          ]"
          cta-text="Talk to Sales"
          cta-to="/contact"
        />
      </div>
    </div>
  </section>
</template>
<script setup lang>
  import PricingTeaserCard from '~/components/home/PricingTeaserCard.vue'
</script>
