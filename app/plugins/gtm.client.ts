
export default defineNuxtPlugin((nuxtApp: any) => {
  if (process.client) {
    const config = useRuntimeConfig();
    const gtmId = config.public.GTAG_ID || '';
    
    if (!gtmId) {
      console.warn('GTM ID is not set. Please set NUXT_PUBLIC_GTAG_ID in your .env file');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', gtmId, { 
      'send_page_view': false,
      'transport_url': 'https://www.google-analytics.com',
      'first_party_collection': true
    });

    const loadGTM = () => {
      if (window.dataLayer.loaded) return;
      
      window.dataLayer.loaded = true;
      
      const script = document.createElement('script');
      script.async = true;
      script.fetchPriority = 'low';
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      
      if ('connection' in navigator && (navigator as any).connection.saveData) {
        return;
      }
      
      const loadScript = () => {
        document.head.appendChild(script);
        
        script.onload = () => {
          setTimeout(() => {
            window.gtag('event', 'page_view');
          }, 100);
        };
      };
      
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadScript, { timeout: 3000 });
      } else {
        const delay = window.requestAnimationFrame ? 
          window.requestAnimationFrame(loadScript) : 
          setTimeout(loadScript, 800);
      }
      
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.loading = 'lazy';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    };

    const loadOnInteraction = () => {
      document.removeEventListener('DOMContentLoaded', loadOnInteraction);
      window.removeEventListener('load', loadOnInteraction);
      
      setTimeout(loadGTM, 800);
    };

    if (document.readyState === 'complete') {
      loadOnInteraction();
    } else {
      const events = ['mousemove', 'scroll', 'keydown', 'touchstart'];
      const onFirstInteraction = () => {
        events.forEach(event => {
          window.removeEventListener(event, onFirstInteraction, { passive: true });
        });
        loadOnInteraction();
      };
      
      events.forEach(event => {
        window.addEventListener(event as keyof WindowEventMap, onFirstInteraction, { 
          passive: true, 
          once: true 
        } as AddEventListenerOptions);
      });
      
      window.addEventListener('load', loadOnInteraction, { once: true });
    }
  }
});
