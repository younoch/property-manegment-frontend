/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts,vue}',
    './plugins/**/*.{js,ts,vue}'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: false,
    float: false,
    objectFit: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
  },
}
