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

  // Track page views - defined first to be hoisted
  const trackPageView = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Tracking page view:', window.location.pathname);
      return;
    }
    
    // Use requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
          });
        },
        { timeout: 2000 } // Max wait time of 2s
      );
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname
        });
      }, 0);
    }
  };

  // Load GA script after page load
  const loadGA = () => {
    if (document.readyState === 'complete') {
      initGA();
    } else {
      window.addEventListener('load', initGA, { once: true });
    }
  };

  // Initialize GA4
  const initGA = () => {
    // Create script with defer and async
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    
    script.onload = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Google Analytics initialized with ID:', gtagId);
      }
      
      // Configure GA4
      window.gtag('js', new Date());
      window.gtag('config', gtagId, {
        send_page_view: false, // We handle page views manually
        transport_type: 'beacon',
        allow_google_signals: false,
        anonymize_ip: true,
        debug_mode: process.env.NODE_ENV !== 'production'
      });

      // Track initial page view
      trackPageView();
    };

    // Add script to document
    document.head.appendChild(script);
  };

  // Start loading GA after a short delay
  setTimeout(loadGA, 0);

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
  