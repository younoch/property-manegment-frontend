import { ref, onUnmounted } from 'vue';

// Enhanced TypeScript types for Google Charts
type GoogleCharts = {
  charts: {
    load: (version: string, options: { packages: string[] }) => void;
    setOnLoadCallback: (callback: () => void) => void;
  };
  visualization: {
    arrayToDataTable: (data: any[][], isFirstRowLabels?: boolean) => any;
    events: {
      addListener: (chart: any, event: string, handler: () => void) => void;
      removeListener: (listener: any) => void;
    };
    [key: string]: any;
  };
};

declare global {
  interface Window {
    google?: GoogleCharts;
  }
}

export interface GoogleChartOptions {
  packages?: string[];
  version?: string;
  language?: string;
  callback?: () => void;
}

const DEFAULT_OPTIONS: Required<GoogleChartOptions> = {
  packages: ['corechart', 'bar', 'table'],
  version: 'current',
  language: 'en',
  callback: () => {}
};

export function useGoogleCharts(options: GoogleChartOptions = {}) {
  const isGoogleChartsLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const chartInstances = ref<Set<any>>(new Set());
  
  // Merge default options with user options
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  // Singleton promise for loading Google Charts
  let googleReadyPromise: Promise<boolean> | null = null;
  let resizeObservers: Map<Element, ResizeObserver> = new Map();

  // Cleanup function to remove all listeners and observers
  const cleanup = () => {
    chartInstances.value.forEach(chart => {
      if (chart && typeof chart.clearChart === 'function') {
        chart.clearChart();
      }
    });
    
    resizeObservers.forEach((observer, element) => {
      observer.unobserve(element);
      observer.disconnect();
    });
    resizeObservers.clear();
    chartInstances.value.clear();
  };

  // Handle window resize for responsive charts
  const handleResize = (chart: any, container: HTMLElement) => {
    if (!chart || !container) return;
    
    // Remove existing observer if it exists
    if (resizeObservers.has(container)) {
      const observer = resizeObservers.get(container);
      observer?.unobserve(container);
      observer?.disconnect();
    }

    const observer = new ResizeObserver(() => {
      if (chart && typeof chart.draw === 'function') {
        requestAnimationFrame(() => {
          chart.draw(chart.getDataTable(), chart.getOptions());
        });
      }
    });

    observer.observe(container);
    resizeObservers.set(container, observer);
  };

  // Load Google Charts with retry logic
  const loadGoogleCharts = (retryCount = 2): Promise<boolean> => {
    if (isGoogleChartsLoaded.value) return Promise.resolve(true);
    if (googleReadyPromise) return googleReadyPromise;

    isLoading.value = true;
    error.value = null;

    googleReadyPromise = new Promise((resolve, reject) => {
      // Check if already loaded by another instance
      if (window.google?.visualization) {
        isGoogleChartsLoaded.value = true;
        isLoading.value = false;
        return resolve(true);
      }

      const script = document.createElement('script');
      script.src = `https://www.gstatic.com/charts/loader.js`;
      script.async = true;
      script.defer = true;
      script.fetchPriority = 'low';
      script.crossOrigin = 'anonymous';
      
      const onLoad = () => {
        try {
          if (!window.google) {
            throw new Error('Google Charts library not available');
          }

          window.google.charts.load(mergedOptions.version, {
            packages: mergedOptions.packages,
            language: mergedOptions.language,
            callback: () => {
              isGoogleChartsLoaded.value = true;
              isLoading.value = false;
              mergedOptions.callback?.();
              resolve(true);
            }
          });
        } catch (err) {
          handleError(err);
          reject(err);
        }
      };

      const handleError = (err: unknown) => {
        const errorMessage = err instanceof Error 
          ? err 
          : new Error('Failed to load Google Charts');
          
        error.value = errorMessage;
        isLoading.value = false;
        
        // Clean up the failed script
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        
        // Retry logic
        if (retryCount > 0) {
          setTimeout(() => {
            loadGoogleCharts(retryCount - 1).then(resolve).catch(reject);
          }, 1000 * (3 - retryCount)); // Exponential backoff
        } else {
          reject(errorMessage);
        }
      };
      
      script.onload = onLoad;
      script.onerror = () => handleError(new Error('Failed to load Google Charts script'));
      
      // Add to document
      document.head.appendChild(script);
    });

    return googleReadyPromise;
  };

  // Create a new chart instance
  const createChart = async (element: HTMLElement, type: string, data: any[][], options: any = {}) => {
    try {
      await loadGoogleCharts();
      
      if (!window.google?.visualization) {
        throw new Error('Google Charts visualization module not available');
      }

      const dataTable = window.google.visualization.arrayToDataTable(data, true);
      const chart = new window.google.visualization[type](element);
      
      // Store the chart instance for cleanup
      chartInstances.value.add(chart);
      
      // Handle responsive behavior
      if (options.responsive !== false) {
        handleResize(chart, element);
      }
      
      // Draw the chart
      chart.draw(dataTable, options);
      
      return chart;
    } catch (err) {
      console.error('Error creating chart:', err);
      throw err;
    }
  };

  // Cleanup on component unmount
  onUnmounted(() => {
    cleanup();
  });

  return {
    loadGoogleCharts,
    createChart,
    isGoogleChartsLoaded,
    isLoading,
    error,
    cleanup,
    chartInstances
  };
}

export default useGoogleCharts;
