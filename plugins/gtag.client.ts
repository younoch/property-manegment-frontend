// Type declarations for gtag.js
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (process.server) return

  const { public: { NUXT_PUBLIC_GTAG_ID: gtagId } } = useRuntimeConfig()
  if (!gtagId) {
    console.warn('❌ NUXT_PUBLIC_GTAG_ID not set')
    return
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 GA Event:', ...arguments)
    }
    window.dataLayer.push(arguments)
  }

  // Track page views with requestIdleCallback
  const trackPageView = () => {
    const send = () => {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(send, { timeout: 2000 })
    } else {
      setTimeout(send, 0)
    }
  }

  // Load GA with minimal impact on LCP/FCP
  const loadGA = () => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.fetchPriority = 'low'  // Mark as low priority
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    
    script.onload = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Google Analytics initialized')
      }

      // Configure GA with performance optimizations
      window.gtag('js', new Date())
      window.gtag('config', gtagId, {
        send_page_view: false,  // We handle page views manually
        transport_type: 'beacon',  // Use Beacon API for better performance
        anonymize_ip: true,
        allow_google_signals: false,
        debug_mode: process.env.NODE_ENV !== 'production'
      })

      // Track initial page view with a small delay
      setTimeout(trackPageView, 500)
    }

    // Add to document
    document.head.appendChild(script)
  }

  // Wait for browser to be idle before loading GA
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadGA, { timeout: 2000 })
  } else {
    // Fallback: Load after a short delay
    setTimeout(loadGA, 2000)
  }

  // Track route changes
  nuxtApp.hook('page:finish', trackPageView)
})
