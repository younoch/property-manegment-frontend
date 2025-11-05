// Type declarations for gtag.js
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (process.server) return;

  const config = useRuntimeConfig();
  const gtagId = config.public.NUXT_PUBLIC_GTAG_ID;
  
  if (!gtagId) {
    console.warn('❌ NUXT_PUBLIC_GTAG_ID not set');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 GA Event:', ...arguments);
    }
    window.dataLayer.push(arguments);
  };

  // Add gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
  
  // Initialize GA with config
  script.onload = () => {
    console.log('✅ Google Analytics initialized with ID:', gtagId);
    
    // Configure GA4
    window.gtag('js', new Date());
    window.gtag('config', gtagId, {
      send_page_view: false, // We'll handle page views manually
      transport_type: 'beacon', // Use Beacon API for better reliability
      allow_google_signals: false,
      anonymize_ip: true,
      debug_mode: process.env.NODE_ENV !== 'production'
    });

    // Initial page view
    trackPageView();
  };

  // Track page views
  const trackPageView = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Tracking page view:', window.location.pathname);
      return;
    }
    
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  };

  // Track route changes
  nuxtApp.hook('page:finish', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Route changed, tracking page view');
    }
    trackPageView();
  });

  // Add script to document
  document.head.appendChild(script);
});
  