export default defineNuxtPlugin((nuxtApp) => {
    let googleReadyPromise: Promise<void> | null = null
  
    function loadGoogleCharts(): Promise<void> {
      if (googleReadyPromise) return googleReadyPromise
  
      googleReadyPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://www.gstatic.com/charts/loader.js'
        script.async = true
        script.onload = () => {
          // @ts-ignore
          window.google.charts.load('current', { packages: ['corechart', 'bar', 'table'] })
          // @ts-ignore
          window.google.charts.setOnLoadCallback(resolve)
        }
        script.onerror = () => reject(new Error('Failed to load Google Charts'))
        document.head.appendChild(script)
      })
  
      return googleReadyPromise
    }
  
    nuxtApp.provide('googleChartsReady', loadGoogleCharts)
  })
  