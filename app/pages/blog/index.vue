<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="relative bg-gray-50 py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="absolute inset-0">
        <div class="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div class="relative mx-auto max-w-7xl">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            <span class="block">Our Blog</span>
            <span class="block text-primary-600">Latest Updates & News</span>
          </h1>
          <p class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Stay updated with the latest property management tips, industry news, and company updates.
          </p>
        </div>
      </div>
    </div>

    <!-- Blog Posts -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Blog post cards -->
        <article v-for="post in blogPosts" :key="post.id" class="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <div class="shrink-0">
            <img class="h-48 w-full object-cover" :src="post.image" :alt="post.title" loading="lazy">
          </div>
          <div class="flex flex-1 flex-col justify-between bg-white p-6">
            <div class="flex-1">
              <p class="text-sm font-medium text-primary-600">
                {{ post.category }}
              </p>
              <NuxtLink :to="`/blog/${post.slug}`" class="mt-2 block">
                <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
                  {{ post.title }}
                </h3>
                <p class="mt-3 text-base text-gray-500 line-clamp-3">
                  {{ post.excerpt }}
                </p>
              </NuxtLink>
            </div>
            <div class="mt-6 flex items-center">
              <div class="shrink-0">
                <span class="sr-only">{{ post.author.name }}</span>
                <img class="h-10 w-10 rounded-full" :src="`${post.author.image}&w=40`" :alt="post.author.name" loading="lazy">
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  {{ post.author.name }}
                </p>
                <div class="flex space-x-1 text-sm text-gray-500">
                  <time :datetime="post.datetime">
                    {{ post.date }}
                  </time>
                  <span aria-hidden="true">&middot;</span>
                  <span>{{ post.readingTime }} read</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set the layout explicitly
definePageMeta({
  layout: 'public'
});

// Import blog posts data
import { blogPosts } from '~/data/blogPosts';

// SEO and Social Meta
useHead({
  title: 'Blog - Latest Property Management Insights & Tips',
  meta: [
    { name: 'description', content: 'Latest property management tips, industry news, and company updates from LeaseDirector.' }
  ]
});
</script>
