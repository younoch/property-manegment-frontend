// Type declarations for gtag.js
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return

  const { public: { NUXT_PUBLIC_GTAG_ID: gtagId } } = useRuntimeConfig()
  if (!gtagId) {
    console.warn('❌ Missing NUXT_PUBLIC_GTAG_ID')
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') console.log('📊 GA Event:', ...args)
    window.dataLayer.push(args)
  }

  const sendPageView = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Tracking page view:', window.location.pathname)
      return
    }
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    })
  }

  const initGA = () => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    script.onload = () => {
      if (process.env.NODE_ENV !== 'production')
        console.log('✅ Google Analytics initialized:', gtagId)

      window.gtag('js', new Date())
      window.gtag('config', gtagId, {
        send_page_view: false,
        transport_type: 'beacon',
        anonymize_ip: true,
        allow_google_signals: false,
        debug_mode: process.env.NODE_ENV !== 'production'
      })
      sendPageView()
    }
    document.head.appendChild(script)
  }

  // ✅ Keep GA load minimal delay after DOM is ready (best LCP balance)
  if (document.readyState === 'complete') initGA()
  else window.addEventListener('load', initGA, { once: true })

  // Track route changes
  nuxtApp.hook('page:finish', () => sendPageView())
})
