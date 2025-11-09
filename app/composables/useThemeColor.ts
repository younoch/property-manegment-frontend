// composables/useThemeColor.ts
export type ThemeKey =
  | 'black' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue'
  | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

type ThemeOption = {
  tailwind: string
  cssVar: string
  foreground: string
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
  blue:    { tailwind: 'blue',    cssVar: 'var(--color-blue-500)',    foreground: 'white', bgClass: 'bg-blue-500' },
  indigo:  { tailwind: 'indigo',  cssVar: 'var(--color-indigo-500)',  foreground: 'white', bgClass: 'bg-indigo-500' },
  violet:  { tailwind: 'violet',  cssVar: 'var(--color-violet-500)',  foreground: 'white', bgClass: 'bg-violet-500' },
  purple:  { tailwind: 'purple',  cssVar: 'var(--color-purple-500)',  foreground: 'white', bgClass: 'bg-purple-500' },
  fuchsia: { tailwind: 'fuchsia', cssVar: 'var(--color-fuchsia-500)', foreground: 'white', bgClass: 'bg-fuchsia-500' },
  pink:    { tailwind: 'pink',    cssVar: 'var(--color-pink-500)',    foreground: 'white', bgClass: 'bg-pink-500' },
  rose:    { tailwind: 'rose',    cssVar: 'var(--color-rose-500)',    foreground: 'white', bgClass: 'bg-rose-500' }
}

const STORAGE_KEY = 'ui.primary.theme'

export function useThemeColor() {
  const current = useState<ThemeKey>('theme-color', () => 'green')

  function applyToDOM(key: ThemeKey) {
    const opt = THEME_OPTIONS[key]
    const root = document.documentElement
    root.style.setProperty('--ui-primary', opt.cssVar)
    root.style.setProperty('--ui-primary-foreground', opt.foreground)

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
      localStorage.setItem(STORAGE_KEY, key)
      applyToDOM(key)
    }
  }

  function initFromStorage() {
    if (!process.client) return
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeKey | null
    const fallback: ThemeKey = 'green'
    const key = (saved && THEME_OPTIONS[saved] ? saved : fallback) as ThemeKey
    current.value = key
    applyToDOM(key)
  }

  const keys = Object.keys(THEME_OPTIONS) as ThemeKey[]

  return { current, setTheme, initFromStorage, options: THEME_OPTIONS, keys }
}
