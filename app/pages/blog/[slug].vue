<template>
  <article class="bg-white">
    <!-- Article Header -->
    <div class="relative bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div class="absolute inset-0">
        <div class="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div class="relative mx-auto max-w-7xl">
        <div class="text-center">
          <p class="text-base font-semibold uppercase tracking-wide text-primary-600">
            {{ post.category }}
          </p>
          <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {{ post.title }}
          </h1>
          <div class="mt-4 md:mt-6 flex items-center justify-center">
            <div class="shrink-0">
              <span class="sr-only">{{ post.author.name }}</span>
              <img class="h-10 w-10 rounded-full" :src="post.author.image" :alt="post.author.name">
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">
                {{ post.author.name }}
              </p>
              <div class="flex space-x-1 text-sm text-gray-500">
                <time :datetime="post.datetime">{{ post.date }}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{{ post.readingTime }} read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div class="mx-auto w-full max-w-3xl px-4 py-2 sm:p-6 lg:p-8">
      <div class="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-500">
        <img class="w-full rounded-lg shadow-md" :src="post.image" :alt="post.title">
        
        <!-- Blog post content -->
        <div class="mt-6 sm:mt-8">
          <p class="text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl md:leading-8">
            {{ post.excerpt }}
          </p>
          
          <div class="mt-8 sm:mt-10">
            <h2 class="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6">Getting Started</h2>
            <div class="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-700">
              <p class="mb-4 sm:mb-6">
                This is a sample blog post. In a real application, you would fetch the blog post content
                from your CMS or API based on the slug parameter. The content would be properly formatted
                with rich text elements like headings, lists, and more.
              </p>
            </div>
          </div>
          
          <!-- Author Section -->
          <div class="mt-6 border-t border-gray-200 pt-4 sm:mt-12">
            <div class="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div class="shrink-0">
                <img class="h-16 w-16 rounded-full" :src="post.author.image" :alt="post.author.name">
              </div>
              <div class="text-center sm:text-left">
                <p class="text-lg font-medium text-gray-900">{{ post.author.name }}</p>
                <p class="text-sm text-gray-500">Author</p>
                <p class="mt-2 text-sm text-gray-500 sm:mt-3">
                  {{ post.author.bio || 'Property management expert with years of experience helping landlords succeed.' }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Related Posts -->
          <div class="mt-12 sm:mt-16">
            <h3 class="mb-2 md:mb-6 text-lg font-bold text-gray-900 sm:text-xl">You might also like</h3>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <div v-for="related in relatedPosts" :key="related.id" class="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div class="aspect-w-16 aspect-h-9 overflow-hidden sm:aspect-h-10">
                  <img :src="related.image" :alt="related.title" class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-52">
                </div>
                <div class="p-4">
                  <h4 class="text-base font-medium text-gray-900 line-clamp-2">
                    <NuxtLink :to="`/blog/${related.slug}`" class="hover:text-primary-600">
                      {{ related.title }}
                    </NuxtLink>
                  </h4>
                  <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ related.excerpt }}</p>
                </div>
              </div>
            </div>
          </div>
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

// Set page metadata
useHead({
  title: `${post.value?.title || 'Blog Post'} - Blog - LeaseDirector`,
  meta: [
    { name: 'description', content: post.value?.excerpt || 'Read our latest blog post' }
  ]
});
</script>
