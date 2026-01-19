import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.sinau.collection',
  appName: 'collection-app',
  webDir: '.output/public', // ← arahkan ke hasil generate Nuxt 3
  bundledWebRuntime: false
};

export default config;
