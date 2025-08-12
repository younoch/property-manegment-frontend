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
  