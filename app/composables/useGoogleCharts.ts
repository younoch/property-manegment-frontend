import { ref, onUnmounted } from 'vue';
import { useRuntimeConfig } from '#imports';

// Enhanced TypeScript types for Google Charts
type GoogleCharts = {
  charts: {
    load: (version: string, options: { packages: string[]; language?: string }) => void;
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
  const config = useRuntimeConfig();
  // Always use Google's official CDN loader (per Google Charts policy)
  const primaryLoader = 'https://www.gstatic.com/charts/loader.js';
  const altLoader = '';

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
      // SSR guard
      if (typeof window === 'undefined') {
        console.debug('[GoogleCharts] Skipping load on server');
        isLoading.value = false;
        return resolve(false);
      }
      const w = window as any;
      // Check if already loaded by another instance
      if (w.google?.visualization) {
        isGoogleChartsLoaded.value = true;
        isLoading.value = false;
        console.debug('[GoogleCharts] Already loaded');
        return resolve(true);
      }

      // Avoid injecting duplicate loader script
      const existing = document.querySelector(`script[src="${primaryLoader}"]`);
      const script = existing instanceof HTMLScriptElement ? existing : document.createElement('script');
      script.src = primaryLoader;
      script.async = true;
      script.defer = true;
      script.fetchPriority = 'low';
      script.referrerPolicy = 'no-referrer';
      // Avoid crossOrigin on script tag to prevent strict CORS blockers in some environments
      
      const onLoad = () => {
        try {
          const w = window as any;
          if (!w.google) {
            throw new Error('Google Charts library not available');
          }

          console.debug('[GoogleCharts] loader.js loaded, calling charts.load(...)');
          w.google.charts.load(mergedOptions.version, {
            packages: mergedOptions.packages,
            language: mergedOptions.language
          });

          // Use setOnLoadCallback properly
          w.google.charts.setOnLoadCallback(() => {
            console.debug('[GoogleCharts] charts loaded');
            isGoogleChartsLoaded.value = true;
            isLoading.value = false;
            try { mergedOptions.callback?.(); } catch {}
            resolve(true);
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
      
      // Attach listeners only if not already attached
      if (!existing) {
        script.onload = onLoad;
        script.onerror = (e) => {
          console.error('[GoogleCharts] loader.js failed to load', e);
          handleError(new Error('Failed to load Google Charts script'))
        };
        // Add to document
        document.head.appendChild(script);
        // Safety timeout: if script reports "complete" but no load event fired
        setTimeout(() => {
          if ((script as any).readyState === 'complete' && !isGoogleChartsLoaded.value) {
            console.debug('[GoogleCharts] loader readyState complete without onload, invoking onLoad');
            onLoad();
          }
        }, 2500);
      } else {
        // If already present, assume it may be loaded soon
        console.debug('[GoogleCharts] Loader script already present, waiting for load');
        if ((existing as any).readyState === 'complete') {
          onLoad();
        } else {
          existing.addEventListener('load', onLoad, { once: true });
          existing.addEventListener('error', (e) => {
            console.error('[GoogleCharts] existing loader.js error', e);
            handleError(new Error('Existing Google Charts script failed'))
          } , { once: true });
        }
      }
    });

    return googleReadyPromise;
  };

  // Create a new chart instance
  const createChart = async (element: HTMLElement, type: string, data: any[][], options: any = {}) => {
    try {
      await loadGoogleCharts();
      const w = window as any;
      if (!w.google?.visualization) {
        throw new Error('Google Charts visualization module not available');
      }

      const dataTable = w.google.visualization.arrayToDataTable(data, true);
      const chart = new w.google.visualization[type](element);
      
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
