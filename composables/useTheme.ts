import { ref, onMounted, watch } from 'vue';

export function useTheme() {
  const isDark = ref(false);

  // Check system preference
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Set theme based on user preference or system preference
  const setTheme = (theme: 'light' | 'dark' | 'system' = 'system') => {
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      isDark.value = systemTheme === 'dark';
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      isDark.value = theme === 'dark';
    }
  };

  // Watch for system theme changes
  const watchSystemTheme = () => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (document.documentElement.classList.contains('system-theme')) {
        setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  };

  // Initialize
  onMounted(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    
    // Set up system theme watcher
    watchSystemTheme();
  });

  // Watch for theme changes
  watch(isDark, (newVal) => {
    document.documentElement.classList.toggle('dark', newVal);
  });

  return {
    isDark,
    setTheme
  };
}
