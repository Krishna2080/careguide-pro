import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.careguide.pro',
  appName: 'CareGuide Pro',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  },
  server: {
    url: "https://352b0036-1496-40f2-bfc1-7bae45650a05.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;