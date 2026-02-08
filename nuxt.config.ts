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
    plugins: [tailwindcss()],
    build: {
      // Code splitting for better performance
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'pinia': ['pinia'],
            'icons': ['@heroicons/vue']
          }
        }
      }
    }
  },

  typescript: {
    strict: true
  },

  modules: ['@nuxtjs/google-fonts', '@nuxt/image'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://yrnjmjgvxmdzttuzqued.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_9JvTsTqQaImQL5dRucXMxQ_4zURS89J',
    }
  },

  googleFonts: {
    families: {
      Poppins: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: 'swap',
    preconnect: true,
  },

  // Image optimization
  image: {
    quality: 80,
    format: ['webp', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
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
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
  },

  // Lazy load components
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: true,
      }
    ]
  }
})
