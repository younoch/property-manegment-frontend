export default defineNuxtPlugin(() => {
    if (process.env.NODE_ENV !== 'production') return
  
    const config = useRuntimeConfig()
    const gtagId = config.public.GTAG_ID
  
    if (!gtagId) return console.warn('Google Analytics ID not found')
  
    // Load GA script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
    document.head.appendChild(script)
  
    // Initialize GA
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      // @ts-ignore
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', gtagId, { page_path: window.location.pathname })
  
    // Auto track route changes
    const router = useRouter()
    router.afterEach((to) => {
      gtag('event', 'page_view', { page_path: to.fullPath })
    })
  })
  