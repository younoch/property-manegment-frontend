// GTM and dataLayer type definitions
declare global {
  interface Window {
    dataLayer: any[] & {
      loaded?: boolean;
      push: (...args: any[]) => void;
    };
    gtag: (...args: any[]) => void;
  }
}

export {};
