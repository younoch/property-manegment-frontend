
export default defineNuxtPlugin((nuxtApp: any) => {
  if (!process.client) return;

  const config = useRuntimeConfig();
  const id = config.public.GTAG_ID || '';
  const isProd = (config.public.nodeEnv || process.env.NODE_ENV) === 'production';

  if (!id) {
    console.warn('Analytics ID is not set. Please set NUXT_PUBLIC_GTAG_ID in your .env file');
    return;
  }

  // Disable analytics in non-production to avoid noisy errors and blocked requests
  if (!isProd) {
    console.info('[Analytics] Disabled in non-production environment');
    return;
  }

  // Initialize dataLayer and gtag helper
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  } as any;

  const loadScript = (src: string, onload?: () => void) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    s.fetchPriority = 'low';
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  };

  if (id.startsWith('GTM-')) {
    // Load Google Tag Manager container (expects a GTM-XXXX id)
    // ns iframe is optional for SPA; skip to minimize noise
    const start = () => {
      loadScript(`https://www.googletagmanager.com/gtm.js?id=${id}`, () => {
        // Optionally push initial page_view via GTM configuration
      });
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(start, { timeout: 3000 });
    } else {
      setTimeout(start, 800);
    }
  } else if (id.startsWith('G-')) {
    // Load GA4 (gtag.js) correctly for measurement ID G-XXXX
    const init = () => {
      window.gtag('js', new Date());
      window.gtag('config', id, {
        send_page_view: false,
        transport_type: 'beacon', // avoid CORS with credentials
        anonymize_ip: true
      });
      // Example: manual page_view event after route change can be added elsewhere
      // window.gtag('event', 'page_view');
    };
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${id}`, init);
  } else {
    console.warn('[Analytics] Unknown ID format. Expected GTM-XXXX or G-XXXX.');
  }
});
