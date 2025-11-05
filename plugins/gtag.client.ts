// Type declarations for gtag.js
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

type GTagEvent = {
  event_category?: string
  event_label?: string
  value?: any
  [key: string]: any
}

const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  } else {
    console.warn('gtag not available', args)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const gtagId = config.public.GTAG_ID
    if (!gtagId) return console.warn('❌ GTAG_ID not set')

    // Add gtag function and dataLayer
    const gtagScript = document.createElement('script')
    gtagScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){window.dataLayer.push(arguments);};
      window.gtag('js', new Date());
      window.gtag('config', '${gtagId}', {
        'send_page_view': false,
        'transport_url': 'https://www.google-analytics.com/g/collect',
        'allow_google_signals': false,
        'anonymize_ip': true,
        'debug_mode': ${process.env.NODE_ENV !== 'production'}
      });
    `
    document.head.appendChild(gtagScript)
  
    // Load GA script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    document.head.appendChild(script)
  
    // Track page views manually with a slight delay
    script.onload = () => {
      console.log('✅ Google Analytics initialized with ID:', gtagId)
      
      // Add a small delay before sending the first page view
      setTimeout(() => {
        gtag('event', 'page_view', {
          'page_title': document.title,
          'page_location': window.location.href,
          'page_path': window.location.pathname,
          'send_to': gtagId
        })
      }, 100)
    }

    // Track route changes
    nuxtApp.hook('page:finish', () => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        gtag('event', 'page_view', {
          'page_title': document.title,
          'page_location': window.location.href,
          'page_path': window.location.pathname,
          'send_to': gtagId
        })
      }
    })
})
  