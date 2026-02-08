interface SystemConfig {
    public: {
        imagekitPublicKey: string
        imagekitPrivateKey: string
        imagekitUrlEndpoint: string
        opencageApiKey: string
        apiBaseUrl: string
        appName: string
        appVersion: string
    }
}

/**
 * System configuration
 * Access environment variables safely
 */
export const useSystemConfig = (): SystemConfig => {
    const config: SystemConfig = {
        public: {
            // ImageKit
            imagekitPublicKey: process.env.NUXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
            imagekitPrivateKey: process.env.NUXT_PUBLIC_IMAGEKIT_PRIVATE_KEY || '',
            imagekitUrlEndpoint: process.env.NUXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',

            // OpenCage Geocoding
            opencageApiKey: process.env.NUXT_PUBLIC_OPENCAGE_API_KEY || 'c808fbb3f98f4c2594aeebf8fc8f68f8',

            // API
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',

            // App
            appName: process.env.NUXT_PUBLIC_APP_NAME || 'JAVA.co Sales App',
            appVersion: process.env.NUXT_PUBLIC_APP_VERSION || '1.0.0',

            // Supabase
            supabaseUrl: process.env.SUPABASE_URL || 'https://yrnjmjgvxmdzttuzqued.supabase.co',
            supabaseAnonKey: process.env.SUPABASE_KEY || 'sb_publishable_9JvTsTqQaImQL5dRucXMxQ_4zURS89J',
        }
    }

    return config
}
