// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        { src: 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js' }
      ]
    },
    loadingIndicator: {
      name: 'circle',
      color: '#3B82F6',
      background: 'white'
    }
  },
  vite: {
    plugins: [ tailwindcss() ]
  },
  typescript: {
    strict: true
  },
  modules: ['@nuxtjs/google-fonts', '@nuxt/image'],
  googleFonts: {
    families: {
      Poppins: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: 'swap',
    preconnect: true,
  },
  router: {
    options: {
      middleware: ['setTitle']
    }
  },
  ssr: false,
  css: ['~/assets/css/main.css'],
  devServer: {
    host: '0.0.0.0'
  }
})
