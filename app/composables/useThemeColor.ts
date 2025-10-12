// composables/useThemeColor.ts
import { useCookie } from '#imports'
import { useAppConfig } from '#imports'

export type ThemeKey =
  | 'black' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue'
  | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

type ThemeOption = {
  /** Tailwind color token Nuxt UI expects (e.g., 'emerald', 'blue', 'neutral') */
  tailwind: string
  /** CSS var value we’ll set to --ui-primary */
  cssVar: string
  /** 'white' or 'black' text for contrast */
  foreground: string
  /** Tailwind bg utility for the swatch/dot (kept static for Tailwind v4) */
  bgClass: string
}

export const THEME_OPTIONS: Record<ThemeKey, ThemeOption> = {
  black:   { tailwind: 'neutral', cssVar: 'var(--color-neutral-900)', foreground: 'white', bgClass: 'bg-neutral-900' },
  red:     { tailwind: 'red',     cssVar: 'var(--color-red-500)',     foreground: 'white', bgClass: 'bg-red-500' },
  orange:  { tailwind: 'orange',  cssVar: 'var(--color-orange-500)',  foreground: 'white', bgClass: 'bg-orange-500' },
  amber:   { tailwind: 'amber',   cssVar: 'var(--color-amber-500)',   foreground: 'black', bgClass: 'bg-amber-500' },
  yellow:  { tailwind: 'yellow',  cssVar: 'var(--color-yellow-500)',  foreground: 'black', bgClass: 'bg-yellow-500' },
  lime:    { tailwind: 'lime',    cssVar: 'var(--color-lime-500)',    foreground: 'black', bgClass: 'bg-lime-500' },
  green:   { tailwind: 'green',   cssVar: 'var(--color-green-500)',   foreground: 'white', bgClass: 'bg-green-500' },
  emerald: { tailwind: 'emerald', cssVar: 'var(--color-emerald-500)', foreground: 'white', bgClass: 'bg-emerald-500' },
  teal:    { tailwind: 'teal',    cssVar: 'var(--color-teal-500)',    foreground: 'white', bgClass: 'bg-teal-500' },
  cyan:    { tailwind: 'cyan',    cssVar: 'var(--color-cyan-500)',    foreground: 'white', bgClass: 'bg-cyan-500' },
  sky:     { tailwind: 'sky',     cssVar: 'var(--color-sky-500)',     foreground: 'white', bgClass: 'bg-sky-500' },
  indigo:  { tailwind: 'indigo',  cssVar: 'var(--color-indigo-500)',  foreground: 'white', bgClass: 'bg-indigo-500' },
  violet:  { tailwind: 'violet',  cssVar: 'var(--color-violet-500)',  foreground: 'white', bgClass: 'bg-violet-500' },
  purple:  { tailwind: 'purple',  cssVar: 'var(--color-purple-500)',  foreground: 'white', bgClass: 'bg-purple-500' },
  fuchsia: { tailwind: 'fuchsia', cssVar: 'var(--color-fuchsia-500)', foreground: 'white', bgClass: 'bg-fuchsia-500' },
  pink:    { tailwind: 'pink',    cssVar: 'var(--color-pink-500)',    foreground: 'white', bgClass: 'bg-pink-500' },
  rose:    { tailwind: 'rose',    cssVar: 'var(--color-rose-500)',    foreground: 'white', bgClass: 'bg-rose-500' },
  blue:    { tailwind: 'blue',    cssVar: 'var(--color-blue-500)',    foreground: 'white', bgClass: 'bg-blue-500' }
} as const

// Using cookie with 7-day expiration for theme persistence

export function useThemeColor() {
  const themeCookie = useCookie<ThemeKey>('theme-color', {
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  // Initialize state with cookie value or default
  const current = useState<ThemeKey>('theme-color', () => {
    // During SSR, use the cookie value if it exists and is valid
    if (process.server && themeCookie.value && THEME_OPTIONS[themeCookie.value]) {
      return themeCookie.value
    }
    return 'emerald' // Default theme
  })

  function applyToDOM(key: ThemeKey) {
    if (!process.client) return
    
    const opt = THEME_OPTIONS[key]
    if (!opt) return
    
    const root = document.documentElement
    root.style.setProperty('--ui-primary', opt.cssVar)
    
    // Keep Nuxt UI tokens aligned for components using color="primary"
    const cfg = useAppConfig()
    // @ts-expect-error runtime assignment is fine
    cfg.ui ??= {}
    // @ts-expect-error
    cfg.ui.colors ??= {}
    // @ts-expect-error
    cfg.ui.colors.primary = opt.tailwind
  }

  function setTheme(key: ThemeKey) {
    current.value = key
    if (process.client) {
      // Save to cookie with 7-day expiration
      themeCookie.value = key
      applyToDOM(key)
    }
  }

  function initFromStorage() {
    if (!process.client) return
    
    // Get theme from cookie or use current state
    const saved = themeCookie.value
    const fallback = current.value || 'emerald'
    const key = (saved && THEME_OPTIONS[saved] ? saved : fallback) as ThemeKey
    
    // Only update if different from current
    if (key !== current.value) {
      current.value = key
    }
    
    // Always apply to DOM and ensure cookie is set
    applyToDOM(key)
    themeCookie.value = key
  }

  const keys = Object.keys(THEME_OPTIONS) as ThemeKey[]

  return { current, setTheme, initFromStorage, options: THEME_OPTIONS, keys }
}
