import type {
    Ref,
    ComputedRef,
    ShallowRef,
    WritableComputedRef
  } from 'vue';
  
  declare global {
    // Vue reactivity APIs
    const ref: typeof import('vue')['ref'];
    const shallowRef: typeof import('vue')['shallowRef'];
    const computed: typeof import('vue')['computed'];
    const reactive: typeof import('vue')['reactive'];
    const readonly: typeof import('vue')['readonly'];
    const watch: typeof import('vue')['watch'];
    const watchEffect: typeof import('vue')['watchEffect'];

    // Nuxt composables
    const useState: typeof import('#app')['useState'];
    const computed: typeof import('vue')['computed'];
    const defineNuxtPlugin: typeof import('#app')['defineNuxtPlugin'];
    const defineNuxtRouteMiddleware: typeof import('#app')['defineNuxtRouteMiddleware'];
    const definePageMeta: typeof import('#app')['definePageMeta'];
    const navigateTo: typeof import('#app')['navigateTo'];
    const useAsyncData: typeof import('#app')['useAsyncData'];
    const useAuth: () => any;
    const useUserStore: () => any;
    const useCsrf: () => any;

    // Nuxt types
    interface RouteLocationNormalized {
      path: string;
      name?: string;
      params: Record<string, string>;
      query: Record<string, string>;
      hash: string;
      fullPath: string;
      matched: any[];
      meta: any;
      redirectedFrom?: RouteLocationNormalized;
    }

    interface NuxtApp {
      $router?: any;
      $uiReady?: () => boolean;
      $waitForUI?: () => Promise<void>;
      vueApp?: {
        config: {
          errorHandler: (error: Error, instance: any, info: string) => boolean;
        };
      };
      hook: (event: string, callback: () => void | Promise<void>) => void;
      hook: (event: 'app:mounted', callback: () => void | Promise<void>) => void;
      hook: (event: 'page:finish', callback: () => void | Promise<void>) => void;
      hook: (event: 'app:unmount', callback: () => void) => void;
    }
  
    // Vue lifecycle hooks
    const onMounted: typeof import('vue')['onMounted'];
    const onBeforeMount: typeof import('vue')['onBeforeMount'];
    const onUnmounted: typeof import('vue')['onUnmounted'];
    const onBeforeUnmount: typeof import('vue')['onBeforeUnmount'];
    const onUpdated: typeof import('vue')['onUpdated'];
    const onBeforeUpdate: typeof import('vue')['onBeforeUpdate'];
  
    // Common Nuxt composables (optional)
    const useRoute: typeof import('vue-router')['useRoute'];
    const useRouter: typeof import('vue-router')['useRouter'];
  }
  
  export {};
  