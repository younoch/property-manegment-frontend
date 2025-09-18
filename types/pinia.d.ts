import { Pinia } from 'pinia'

declare module '#app' {
  interface NuxtApp {
    $pinia: Pinia
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $pinia: Pinia
  }
}
