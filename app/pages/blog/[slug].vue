<template>
  <article class="bg-white">
    <!-- Breadcrumb -->
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-1 sm:pb-2">
      <UBreadcrumb 
        :items="breadcrumbItems" 
        :ui="{
          list: 'flex items-center gap-1 text-sm text-gray-500',
          active: 'text-gray-900 font-medium',
          inactive: 'hover:text-gray-700 transition-colors',
          icon: { 
            base: 'flex-shrink-0 w-4 h-4',
            active: 'text-gray-900',
            inactive: 'text-gray-400'
          }
        }"
      />
    </div>
    
    <!-- Article Header -->
    <div class="relative bg-gradient-to-b from-gray-50 to-white pt-8 sm:pt-12 md:pt-16 lg:pt-20">
      <div class="absolute inset-0">
        <div class="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div class="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-50 text-primary-700">
            {{ post.category }}
          </span>
          <h1 class="mt-4 sm:mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            {{ post.title }}
          </h1>
          <p class="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            {{ post.excerpt }}
          </p>
          <div class="mt-8 flex items-center justify-center space-x-4">
            <img class="h-12 w-12 rounded-full ring-2 ring-white" :src="post.author.image" :alt="post.author.name">
            <div class="text-left">
              <p class="text-base font-medium text-gray-900">
                {{ post.author.name }}
              </p>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <time :datetime="post.datetime">{{ post.date }}</time>
                <span class="text-gray-300">•</span>
                <span>{{ post.readingTime }} read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div class="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
      <div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-900 
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4 sm:prose-p:my-5
                prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-a:font-medium
                prose-blockquote:border-l-2 sm:prose-blockquote:border-l-4 prose-blockquote:border-l-primary-600 prose-blockquote:bg-gray-50 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:py-3 sm:prose-blockquote:py-4
                prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:shadow-md sm:prose-img:shadow-lg">
        <div v-html="post.content" />
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
      <div class="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl">
        <div class="flex items-center">
          <img class="h-16 w-16 rounded-full" :src="post.author.image" :alt="post.author.name">
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-gray-900">About {{ post.author.name }}</h3>
            <p class="mt-1 text-gray-600">{{ post.author.bio || 'Experienced professional in property management and real estate.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Posts -->
    <div v-if="relatedPosts.length > 0" class="bg-gray-50 py-12 sm:py-16 md:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">You might also like</h2>
          <p class="mt-2 text-base sm:text-lg text-gray-600 px-4 sm:px-0">Discover more articles to help you succeed in property management</p>
        </div>
        <div class="mt-8 sm:mt-10 md:mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="group relative bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="h-48 bg-gray-100 overflow-hidden">
              <img :src="relatedPost.image" :alt="relatedPost.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
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
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
// Set the layout explicitly
definePageMeta({
  layout: 'public'
});

const route = useRoute();

// Import blog posts data
import { blogPosts } from '~/data/blogPosts';

// Find the post with the matching slug
const post = computed(() => {
  return blogPosts.find(p => p.slug === route.params.slug) || {
    title: 'Post not found',
    excerpt: 'The requested blog post could not be found.',
    content: 'The blog post you are looking for does not exist or has been removed.'
  };
});

// Get related posts (excludes current post)
const relatedPosts = computed(() => {
  const currentPostId = post.value?.id;
  if (!currentPostId) return [];
  
  // Filter out current post and get up to 2 related posts
  return blogPosts
    .filter(p => p.id !== currentPostId)
    .slice(0, 2);
});

// Breadcrumb items
const breadcrumbItems = ref([
  {
    label: 'Home',
    to: '/',
    icon: 'i-lucide-home'
  },
  {
    label: 'Blog',
    to: '/blog',
    icon: 'i-lucide-book-open'
  },
  {
    label: post.value?.title || 'Post',
    to: `/blog/${post.value?.slug}`,
    icon: 'i-lucide-file-text'
  }
]);

// Set page metadata
useHead({
  title: `${post.value?.title || 'Blog Post'} - Blog - LeaseDirector`,
  meta: [
    { name: 'description', content: post.value?.excerpt || 'Read our latest blog post' }
  ]
});
</script>
