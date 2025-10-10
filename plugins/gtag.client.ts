export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const gtagId = config.public.GTAG_ID
    if (!gtagId) return console.warn('❌ GTAG_ID not set')
  
    // Load GA script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    document.head.appendChild(script)
  
    // Initialize GA after script loads
    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      window.gtag = function (...args: any[]) {
        window.dataLayer.push(args)
      }
  
      window.gtag('js', new Date())
      window.gtag('config', gtagId, { send_page_view: true })
  
      console.log('✅ Google Analytics initialized with ID:', gtagId)
    }
  })
  