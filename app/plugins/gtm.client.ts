// plugins/ga.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client
  if (!process.client) return;

  const config = useRuntimeConfig();
  const GA_ID = config.public.GTAG_ID;

  if (!GA_ID) {
    console.warn('[GA4] NUXT_PUBLIC_GTAG_ID is not set.');
    return;
  }

  // Initialize minimal dataLayer and gtag stub
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  // Minimal gtag init
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });

  // Load GA script asynchronously
  const loadGAScript = () => {
    if (document.getElementById('ga4-script')) return;

    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    script.onload = () => {
      // Send initial pageview after GA script loads
      window.gtag('event', 'page_view', { page_path: window.location.pathname });
    };
  };

  // Load GA on idle or after first interaction
  const loadGA = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGAScript, { timeout: 2000 });
    } else {
      setTimeout(loadGAScript, 1000);
    }
  };

  // Trigger GA load after user interaction or page load
  if (document.readyState === 'complete') {
    loadGA();
  } else {
    const events = ['mousemove', 'scroll', 'keydown', 'touchstart'];
    const onFirstInteraction = () => {
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
      loadGA();
    };
    events.forEach((e) => window.addEventListener(e, onFirstInteraction, { passive: true, once: true }));
    window.addEventListener('load', loadGA, { once: true });
  }
});
