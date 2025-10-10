export default defineNuxtPlugin(() => {
    if (process.env.NODE_ENV !== 'production') return
  
    const config = useRuntimeConfig()
    const gtagId = config.public.GTAG_ID
    if (!gtagId) return console.warn('❌ GTAG ID not found')
  
    console.log('✅ Analytics plugin loaded with ID:', gtagId)
  
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
  
    script.onload = () => {
      console.log('✅ GA script loaded')
  
      window.dataLayer = window.dataLayer || []
      window.gtag = function (...args: any[]) {
        window.dataLayer.push(args)
      }
  
      window.gtag('js', new Date())
      window.gtag('config', gtagId, { page_path: window.location.pathname })
  
      console.log('🔹 Sent initial page view for:', window.location.pathname)
  
      const router = useRouter()
      router.afterEach((to) => {
        window.gtag('event', 'page_view', {
          page_path: to.fullPath,
          send_to: gtagId
        })
        console.log('🔹 GA page view:', to.fullPath)
      })
  
      // Debug test event
      setTimeout(() => {
        console.log('🔹 Sending GA test_event')
        window.gtag('event', 'test_event', { debug: true })
      }, 3000)
    }
  
    document.head.appendChild(script)
  })
  