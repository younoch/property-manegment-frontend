<template>
  <section class="">
    <div class="container mx-auto px-4 text-center">
      <h3 class="text-2xl md:text-3xl font-bold">Ready to replace spreadsheets?</h3>
      <p class="mt-2 text-gray-600">Create your first lease and send an invoice in minutes.</p>
      <div class="mt-6 flex justify-center gap-3">
        <UButton color="primary" size="lg" to="/auth/signup" class="shadow-lg shadow-primary-200 hover:shadow-primary-300">
          Start Managing Properties Now
        </UButton>
      </div>
      <div class="mt-8 grid grid-cols-2 sm:grid-cols-2 gap-2 max-w-xl mx-auto">
        <img 
          src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=870"
          alt="Property management dashboard preview"
          :width="300"
          :height="200"
          sizes="(max-width: 640px) 40vw, 150px"
          img-class="h-24 w-full object-cover rounded-lg border border-gray-200"
        />
        <img 
          src="/rent-collection-mobile.webp"
          alt="Mobile app interface for rent collection"
          :width="300"
          :height="200"
          sizes="(max-width: 640px) 40vw, 150px"
          img-class="h-24 w-full object-cover rounded-lg border border-gray-200"
        />
      </div>
    </div>
  </section>
</template>
