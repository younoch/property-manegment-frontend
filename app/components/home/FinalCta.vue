<template>
  <section class="py-16">
    <div class="container mx-auto px-4 text-center">
      <h3 class="text-2xl md:text-3xl font-bold">Ready to replace spreadsheets?</h3>
      <p class="mt-2 text-gray-600">Create your first lease and send an invoice in minutes.</p>
      <div class="mt-6 flex justify-center gap-3">
        <UButton color="primary" size="lg" to="/auth/signup" class="shadow-lg shadow-primary-200 hover:shadow-primary-300">
          Start Managing Properties Now
        </UButton>
      </div>
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        <ImageOptimizer 
          src="https://picsum.photos/300/200?random=21"
          alt="Property management dashboard preview"
          :width="300"
          :height="200"
          sizes="(max-width: 640px) 40vw, 150px"
          img-class="h-24 w-full object-cover rounded-lg border border-gray-200"
        />
        <ImageOptimizer 
          src="https://picsum.photos/300/200?random=22"
          alt="Mobile app interface for rent collection"
          :width="300"
          :height="200"
          sizes="(max-width: 640px) 40vw, 150px"
          img-class="h-24 w-full object-cover rounded-lg border border-gray-200"
        />
        <ImageOptimizer 
          src="https://picsum.photos/300/200?random=23"
          alt="Financial reports and analytics"
          :width="300"
          :height="200"
          sizes="(max-width: 640px) 40vw, 150px"
          img-class="h-24 w-full object-cover rounded-lg border border-gray-200"
        />
        <ImageOptimizer 
          src="https://picsum.photos/300/200?random=24"
          alt="Tenant communication portal"
          :width="300"
          :height="200"
          sizes="(max-width: 640px) 40vw, 150px"
          img-class="h-24 w-full object-cover rounded-lg border border-gray-200"
        />
      </div>
    </div>
  </section>
</template>
