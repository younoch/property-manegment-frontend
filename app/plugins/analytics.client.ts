export default defineNuxtPlugin(() => {
    if (process.env.NODE_ENV !== 'production') return
  
    const config = useRuntimeConfig()
    const gtagId = config.public.GTAG_ID
    if (!gtagId) return console.warn('❌ GTAG ID not found')
  
    console.log('✅ Analytics plugin loaded with ID:', gtagId)
  
    // Load GA script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    document.head.appendChild(script)
  
    // Setup dataLayer
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
  
    // Track initial page load
    gtag('js', new Date())
    gtag('config', gtagId, { page_path: window.location.pathname })
  
    console.log('🔹 Sent initial page view for:', window.location.pathname)
  
    // Track SPA navigation
    const router = useRouter()
    router.afterEach((to) => {
      gtag('config', gtagId, { page_path: to.fullPath })
      console.log('🔹 GA page view:', to.fullPath)
    })
  
    // Test event for debugging
    setTimeout(() => {
      console.log('🔹 Sending GA test_event')
      gtag('event', 'test_event', { debug: true })
    }, 3000)
  })
  