export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface UISizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Color schemes for different themes
export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  default: {
    primary: 'emerald',
    secondary: 'blue',
    accent: 'purple',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue'
  },
  modern: {
    primary: 'indigo',
    secondary: 'pink',
    accent: 'emerald',
    success: 'emerald',
    warning: 'amber',
    error: 'rose',
    info: 'sky'
  },
  corporate: {
    primary: 'slate',
    secondary: 'gray',
    accent: 'blue',
    success: 'emerald',
    warning: 'amber',
    error: 'red',
    info: 'blue'
  }
};

// UI sizes for consistent spacing and sizing
export const UI_SIZES: UISizes = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem'    // 64px
};

// Tailwind breakpoints
export const BREAKPOINTS: Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Common spacing values
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem'    // 64px
};

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms'
};

// Z-index values for layering
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060
};

// Border radius values
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
};

// Shadow values
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
};

// Common icon sizes
export const ICON_SIZES = {
  xs: '0.75rem',   // 12px
  sm: '1rem',      // 16px
  md: '1.25rem',   // 20px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
};

// Form field sizes
export const FORM_SIZES = {
  sm: '2rem',      // 32px
  md: '2.5rem',    // 40px
  lg: '3rem'       // 48px
};

// Helper functions
export const getColorScheme = (theme: string = 'default'): ColorScheme => {
  return COLOR_SCHEMES[theme] || COLOR_SCHEMES.default;
};

export const getSpacing = (size: keyof typeof SPACING): string => {
  return SPACING[size];
};

export const getBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): string => {
  return BREAKPOINTS[breakpoint];
};
