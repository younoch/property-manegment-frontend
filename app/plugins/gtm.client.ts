// Optimized GTM loader that loads after page is interactive
export default defineNuxtPlugin((nuxtApp: any) => {
  // Only run on client-side
  if (process.client) {
    // Get GTM ID from runtime config
    const config = useRuntimeConfig();
    const gtmId = config.public.GTAG_ID || '';
    
    if (!gtmId) {
      console.warn('GTM ID is not set. Please set NUXT_PUBLIC_GTAG_ID in your .env file');
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Minimal gtag function to capture early events
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    // Minimal initial config
    window.gtag('js', new Date());
    window.gtag('config', gtmId, { 
      'send_page_view': false, // We'll trigger this manually
      'transport_url': 'https://www.google-analytics.com',
      'first_party_collection': true
    });

    // Function to load GTM
    const loadGTM = () => {
      if (window.dataLayer.loaded) return;
      window.dataLayer.loaded = true;
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);
      
      // Send pageview after GTM loads
      script.onload = () => {
        window.gtag('event', 'page_view');
      };
      
      // Add noscript iframe
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    };

    // Load GTM after page is interactive
    if (document.readyState === 'complete') {
      // If page is already loaded, wait for next tick
      setTimeout(loadGTM, 0);
    } else {
      // Wait for window load event
      window.addEventListener('load', () => {
        // Wait for browser to be idle or timeout after 2s
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadGTM, { timeout: 2000 });
        } else {
          setTimeout(loadGTM, 2000);
        }
      }, { once: true });
    }
  }
});
