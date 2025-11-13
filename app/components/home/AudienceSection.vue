<template>
  <section class="border-t border-gray-100" id="audience" aria-labelledby="audience-heading">
    <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <h2 id="audience-heading" class="text-3xl md:text-4xl font-bold">Built for independent landlords & small teams</h2>
        <ul class="mt-5 space-y-3 text-gray-700">
          <li class="flex gap-3"><UIcon name="i-heroicons-home-modern" class="text-primary-600 mt-0.5"/> Single-property owners who need simple rent tracking</li>
          <li class="flex gap-3"><UIcon name="i-heroicons-building-office" class="text-primary-600 mt-0.5"/> Small portfolios (5–50 units) with recurring invoicing</li>
          <li class="flex gap-3"><UIcon name="i-heroicons-queue-list" class="text-primary-600 mt-0.5"/> Teams that require an audit trail and clear roles</li>
        </ul>
      </div>
        
      <div class="grid grid-cols-2 gap-3">
        <div class="aspect-video overflow-hidden rounded-xl border border-gray-200">
          <img 
            src="/apartment-building-preview.webp" 
            alt="Apartment building preview"
            class="h-full w-full object-cover"
            loading="lazy"
            width="600"
            height="400"
            format="webp"
          />
        </div>
        <div class="aspect-video overflow-hidden rounded-xl border border-gray-200">
          <img 
            src="/reviewing-documents.webp" 
            alt="Small landlord reviewing property documents"
            class="h-full w-full object-cover"
            loading="lazy"
            width="600"
            height="400"
          />
        </div>
        <div class="aspect-video overflow-hidden rounded-xl border border-gray-200">
          <img 
            src="/team-collabarating.webp" 
            alt="Team collaborating on property management"
            class="h-full w-full object-cover"
            loading="lazy"
            width="600"
            height="400"
            format="webp"
          />
        </div>
        <div class="aspect-video overflow-hidden rounded-xl border border-gray-200">
          <img 
            src="/whatsapp-notification.webp" 
            alt="WhatsApp notifications for property management"
            class="h-full w-full object-cover"
            loading="lazy"
            width="600"
            height="400"
            format="webp"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
</script>
