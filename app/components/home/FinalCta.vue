<template>
  <section class="py-16 bg-gradient-to-b from-white to-gray-50">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to replace spreadsheets?
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          Create your first lease and send an invoice in minutes.
        </p>
        
        <div class="flex justify-center gap-4">
          <UButton 
            color="primary" 
            size="lg" 
            to="/auth/signup" 
            class="shadow-lg shadow-primary-200 hover:shadow-primary-300 transition-shadow duration-200"
          >
            Start Managing Properties Now
          </UButton>
          <UButton 
            variant="outline" 
            size="lg" 
            to="/demo" 
            class="border-gray-300 hover:bg-gray-50"
          >
            Watch Demo
          </UButton>
        </div>
        
        <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="relative h-48 sm:h-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-transform hover:scale-[1.02]">
            <img 
              src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=60&w=600"
              alt="Property management dashboard preview showing key metrics and property listings"
              class="w-full h-full object-cover"
              width="600"
              height="400"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span class="text-white font-medium text-sm">Dashboard Overview</span>
            </div>
          </div>
          
          <div class="relative h-48 sm:h-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-transform hover:scale-[1.02]">
            <img 
              src="/rent-collection-mobile.webp"
              alt="Mobile interface showing easy rent collection and payment tracking"
              class="w-full h-full object-cover"
              width="300"
              height="400"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span class="text-white font-medium text-sm">Mobile Payment Tracking</span>
            </div>
          </div>
        </div>
        
        <p class="mt-8 text-sm text-gray-500">
          Join 1,000+ property managers who trust LeaseDirector
        </p>
        
        <div class="mt-6 flex flex-wrap justify-center gap-6 items-center opacity-80">
          <div class="text-gray-700 font-medium">Trusted by:</div>
          <div class="flex items-center space-x-6">
            <span class="text-gray-400 font-medium">Acme Properties</span>
            <span class="text-gray-400 font-medium">BlueSky Realty</span>
            <span class="text-gray-400 font-medium">Urban Living</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
