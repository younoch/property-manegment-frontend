<template>
  <article class="bg-white">
    <!-- Breadcrumb -->
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-1 sm:pb-2">
      <UBreadcrumb :items="breadcrumbItems" :ui="breadcrumbUI" />
    </div>

    <!-- Article Header -->
    <div class="relative bg-gradient-to-b from-gray-50 to-white pt-8 sm:pt-12 md:pt-16 lg:pt-20">
      <div class="absolute inset-0">
        <div class="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div class="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-50 text-primary-700">
          {{ post.category }}
        </span>
        <h1 class="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
          {{ post.title }}
        </h1>
        <p class="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
          {{ post.excerpt }}
        </p>

        <!-- Author Info -->
        <div class="mt-8 flex items-center justify-center space-x-4">
          <img class="h-12 w-12 rounded-full ring-2 ring-white" :src="post.author.image" :alt="post.author.name">
          <div class="text-left">
            <p class="text-base font-medium text-gray-900">{{ post.author.name }}</p>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <time :datetime="post.datetime">{{ post.date }}</time>
              <span class="text-gray-300">•</span>
              <span>{{ post.readingTime }} read</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div class="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <div v-if="!post.content" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <div class="text-sm text-yellow-700">
              No content found. Debug data:
              <pre class="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">{{ JSON.stringify(post, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <div v-if="post.content" v-html="post.content" class="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-900 
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4 sm:prose-p:my-5
        prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-a:font-medium
        prose-blockquote:border-l-2 sm:prose-blockquote:border-l-4 prose-blockquote:border-l-primary-600 
        prose-blockquote:bg-gray-50 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:py-3 sm:prose-blockquote:py-4
        prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:shadow-md sm:prose-img:shadow-lg">
      </div>

      <!-- Tags -->
      <div class="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-100">
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in post.tags" :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Author Bio -->
      <div class="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl flex items-center">
        <img 
          class="h-16 w-16 rounded-full object-cover bg-gray-200" 
          :src="post.author.image || '/images/default-avatar.png'" 
          :alt="post.author.name"
          @error="handleImageError"
        >
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-gray-900">About {{ post.author.name }}</h3>
          <p class="mt-1 text-gray-600">{{ post.author.bio || 'Experienced professional in property management and real estate.' }}</p>
        </div>
      </div>
    </div>

    <!-- Related Posts -->
    <div v-if="relatedPosts.length" class="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">You might also like</h2>
          <p class="mt-2 text-base sm:text-lg text-gray-600 px-4 sm:px-0">Discover more articles to help you succeed in
            property management</p>
        </div>

        <div class="mt-8 sm:mt-10 md:mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="relatedPost in relatedPosts" :key="relatedPost.id"
            class="group relative bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="h-48 bg-gray-100 overflow-hidden">
              <img :src="relatedPost.image" :alt="relatedPost.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
            </div>
            <div class="p-6">
              <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 mb-3">
                {{ relatedPost.category }}
              </span>
              <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
                <NuxtLink :to="`/blog/${relatedPost.slug}`" class="hover:text-primary-600 transition-colors">
                  {{ relatedPost.title }}
                </NuxtLink>
              </h3>
              <div class="mt-4 flex items-center text-sm text-gray-500">
                <time :datetime="relatedPost.datetime">{{ relatedPost.date }}</time>
                <span class="mx-2">•</span>
                <span>{{ relatedPost.readingTime }} read</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center">
          <NuxtLink to="/blog" class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            View all articles
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
definePageMeta({ layout: 'public' });

import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig, useHead } from '#app';
import { blogPosts } from '~/data/blogPosts';

const route = useRoute();
const slug = route.params.slug;
const runtimeConfig = useRuntimeConfig();

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = '/images/default-avatar.png';
};

// Reactive post
const post = computed(() => {
  const defaultPost = {
    title: 'Post not found',
    excerpt: 'The requested blog post could not be found.',
    content: 'The blog post you are looking for does not exist or has been removed.',
    author: { 
      name: 'Unknown', 
      image: '/images/default-avatar.png',
      bio: 'Author information not available.'
    },
    tags: [],
    category: 'Blog',
    date: '',
    datetime: '',
    readingTime: ''
  };
  
  const foundPost = blogPosts.find(p => p.slug === slug);
  
  // Ensure author object has all required fields
  if (foundPost) {
    return {
      ...foundPost,
      author: {
        name: foundPost.author?.name || 'Unknown Author',
        image: foundPost.author?.image || '/images/default-avatar.png',
        bio: foundPost.author?.bio || 'Experienced professional in property management and real estate.'
      }
    };
  }
  
  return defaultPost;
});

// Related posts (exclude current)
const relatedPosts = computed(() => blogPosts.filter(p => p.slug !== slug).slice(0, 3));

// Breadcrumb
const breadcrumbItems = ref([
  { label: 'Home', to: '/', icon: 'i-lucide-home' },
  { label: 'Blog', to: '/blog', icon: 'i-lucide-book-open' },
  { label: post.value.title, to: `/blog/${slug}`, icon: 'i-lucide-file-text' }
]);

const breadcrumbUI = {
  list: 'flex items-center gap-1 text-sm text-gray-500',
  active: 'text-gray-900 font-medium',
  inactive: 'hover:text-gray-700 transition-colors',
  icon: { base: 'flex-shrink-0 w-4 h-4', active: 'text-gray-900', inactive: 'text-gray-400' }
};

// Open Graph / SEO
const ogImage = computed(() => post.value.image || runtimeConfig.public.ogImage || '/og-image.png');

useHead({
  title: `${post.value.title} | Blog - LeaseDirector`,
  meta: [
    { name: 'description', content: post.value.excerpt?.substring(0, 160) || 'Read our latest blog post' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.excerpt?.substring(0, 160) },
    { property: 'og:image', content: ogImage.value },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value.title },
    { name: 'twitter:description', content: post.value.excerpt?.substring(0, 160) },
    { name: 'twitter:image', content: ogImage.value }
  ]
});
</script>
