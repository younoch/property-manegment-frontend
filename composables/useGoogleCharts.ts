import { ref } from 'vue';

// Type declarations for Google Charts
type GoogleCharts = {
  charts: {
    load: (version: string, options: { packages: string[] }) => void;
    setOnLoadCallback: (callback: () => void) => void;
  };
};

declare global {
  interface Window {
    google?: GoogleCharts;
  }
}

export function useGoogleCharts() {
  const isGoogleChartsLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  let googleReadyPromise: Promise<void> | null = null;

  const loadGoogleCharts = (): Promise<void> => {
    if (isGoogleChartsLoaded.value) return Promise.resolve();
    if (googleReadyPromise) return googleReadyPromise;

    isLoading.value = true;
    error.value = null;

    googleReadyPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true;
      script.fetchPriority = 'low';
      
      script.onload = () => {
        try {
          if (!window.google) {
            throw new Error('Google Charts failed to load');
          }
          
          window.google.charts.load('current', { 
            packages: ['corechart', 'bar', 'table'] 
          });
          
          window.google.charts.setOnLoadCallback(() => {
            isGoogleChartsLoaded.value = true;
            isLoading.value = false;
            resolve();
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err : new Error('Failed to initialize Google Charts');
          error.value = errorMessage;
          isLoading.value = false;
          reject(errorMessage);
        }
      };
      
      script.onerror = () => {
        const errorMessage = new Error('Failed to load Google Charts script');
        error.value = errorMessage;
        isLoading.value = false;
        reject(errorMessage);
      };
      
      document.head.appendChild(script);
    });

    return googleReadyPromise;
  };

  return {
    loadGoogleCharts,
    isGoogleChartsLoaded,
    isLoading,
    error,
  };
}

export default useGoogleCharts;
