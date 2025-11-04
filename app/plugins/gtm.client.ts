// Ultra-optimized GTM loader with minimal impact on page load
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

    // Initialize minimal dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Minimal gtag function that queues events until GTM loads
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    // Minimal initial config - disable automatic page views
    window.gtag('js', new Date());
    window.gtag('config', gtmId, { 
      'send_page_view': false, // We'll trigger this manually
      'transport_url': 'https://www.google-analytics.com',
      'first_party_collection': true,
      'optimize_id': 'OPT-XXXXXXX' // Add your optimize container ID if using Optimize
    });

    // Function to load GTM with performance optimization
    const loadGTM = () => {
      if (window.dataLayer.loaded) return;
      
      // Mark as loaded first to prevent duplicate loading
      window.dataLayer.loaded = true;
      
      // Create and append the GTM script
      const script = document.createElement('script');
      script.async = true;
      script.fetchPriority = 'low';
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      
      // Add to document with low priority
      if ('connection' in navigator && (navigator as any).connection.saveData) {
        // Don't load GTM if user has enabled data saver mode
        return;
      }
      
      // Use requestIdleCallback with fallback
      const loadScript = () => {
        document.head.appendChild(script);
        
        // Send pageview after GTM loads
        script.onload = () => {
          // Trigger a pageview after a small delay to ensure GTM is ready
          setTimeout(() => {
            window.gtag('event', 'page_view');
          }, 100);
        };
      };
      
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadScript, { timeout: 3000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        const delay = window.requestAnimationFrame ? 
          window.requestAnimationFrame(loadScript) : 
          setTimeout(loadScript, 1000);
      }
      
      // Add noscript iframe for users with JavaScript disabled
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.loading = 'lazy';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    };

    // Wait for the page to be fully interactive
    const loadOnInteraction = () => {
      // Remove the event listener to ensure this only runs once
      document.removeEventListener('DOMContentLoaded', loadOnInteraction);
      window.removeEventListener('load', loadOnInteraction);
      
      // Load GTM with a small delay to prioritize other resources
      setTimeout(loadGTM, 1000);
    };

    // Start loading GTM after user interaction or on page load
    if (document.readyState === 'complete') {
      loadOnInteraction();
    } else {
      // Load GTM on first user interaction
      const events = ['mousemove', 'scroll', 'keydown', 'touchstart'];
      const onFirstInteraction = () => {
        events.forEach(event => {
          window.removeEventListener(event, onFirstInteraction, { passive: true });
        });
        loadOnInteraction();
      };
      
      events.forEach(event => {
        window.addEventListener(event, onFirstInteraction, { passive: true, once: true });
      });
      
      // Fallback in case there's no user interaction
      window.addEventListener('load', loadOnInteraction, { once: true });
    }
  }
});
