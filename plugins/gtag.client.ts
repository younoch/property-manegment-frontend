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
  window.gtag = function () {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 GA Event:', ...arguments);
    }
    window.dataLayer.push(arguments);
  };

  // Track page views
  const trackPageView = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Tracking page view:', window.location.pathname);
      return;
    }

    const sendPageView = () => {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(sendPageView, { timeout: 2000 });
    } else {
      setTimeout(sendPageView, 0);
    }
  };

  // Load GA script after LCP-critical content
  const loadGA = () => {
    const initGA = () => {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ Google Analytics initialized with ID:', gtagId);
        }

        // GA4 config
        window.gtag('js', new Date());
        window.gtag('config', gtagId, {
          send_page_view: false, // manual page view
          transport_type: 'beacon',
          allow_google_signals: false,
          anonymize_ip: true,
          debug_mode: process.env.NODE_ENV !== 'production'
        });

        // Track initial page view
        trackPageView();
      };

      document.head.appendChild(script);
    };

    // Use requestIdleCallback for GA init to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initGA, { timeout: 3000 });
    } else {
      setTimeout(initGA, 2000);
    }
  };

  // Start loading GA after window load
  window.addEventListener('load', loadGA, { once: true });

  // Track route changes
  nuxtApp.hook('page:finish', () => {
    trackPageView();
  });
});
