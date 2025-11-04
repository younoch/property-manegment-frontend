export default defineNuxtPlugin((nuxtApp: any) => {
  // Get GTM ID from runtime config
  const config = useRuntimeConfig();
  const gtmId = config.public.GTAG_ID || '';
  
  if (!gtmId) {
    console.warn('GTM ID is not set. Please set NUXT_PUBLIC_GTAG_ID in your .env file');
    return;
  }
  // Only run on client-side
  if (process.client) {
    // Use requestIdleCallback to defer GTM loading until the browser is idle
    // or setTimeout as a fallback
    const requestIdleCallback = window.requestIdleCallback || ((fn) => setTimeout(fn, 0));
    
    requestIdleCallback(() => {
      // Check if GTM is already loaded
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        return;
      }

      // Create dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];
      
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      
      // GTM script loader with GA4 configuration
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          
          // Initialize gtag function
          w.gtag = function(){
            w.dataLayer.push(arguments);
          };
          
          // Add default gtag config
          w.gtag('js', new Date());
          w.gtag('config', '${gtmId}');
          
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      
      // Add script to document head
      document.head.appendChild(gtmScript);
      
      // Create noscript iframe (for users with JavaScript disabled)
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.appendChild(noscript);
    });
  }
});
