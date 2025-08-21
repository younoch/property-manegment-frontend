export {}

declare module '#app' {
  interface NuxtApp {
    $googleChartsReady: () => Promise<void>
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $googleChartsReady: () => Promise<void>
  }
}
