<template>
  <section class="py-16 border-t border-gray-100" id="audience" aria-labelledby="audience-heading">
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
        <ImageOptimizer 
          src="/reviewing-documents.webp" 
          alt="Small landlord reviewing property documents"
          :width="400"
          :height="400"
          sizes="(max-width: 640px) 45vw, 200px"
          img-class="h-40 w-full object-cover rounded-xl border border-gray-200"
        />
        <ImageOptimizer 
          src="https://picsum.photos/400/400?random=18" 
          alt="Team collaborating on property management"
          :width="400"
          :height="400"
          sizes="(max-width: 640px) 45vw, 200px"
          img-class="h-40 w-full object-cover rounded-xl border border-gray-200"
        />
        <ImageOptimizer 
          src="https://picsum.photos/400/400?random=19" 
          alt="Organized property invoices and documents"
          :width="400"
          :height="400"
          sizes="(max-width: 640px) 45vw, 200px"
          img-class="h-40 w-full object-cover rounded-xl border border-gray-200"
        />
        <ImageOptimizer 
          src="https://picsum.photos/400/400?random=20" 
          alt="Secure online payment processing"
          :width="400"
          :height="400"
          sizes="(max-width: 640px) 45vw, 200px"
          img-class="h-40 w-full object-cover rounded-xl border border-gray-200"
        />
      </div>
    </div>
  </section>
</template>
<script setup>
import ImageOptimizer from '~/components/common/ImageOptimizer.vue';
</script>
