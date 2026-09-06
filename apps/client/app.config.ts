import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'BUPA-Satsang',
  slug: 'bupa-satsang',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  scheme: 'bupa-satsang',
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true
  },
  web: {
    bundler: 'metro',
    output: 'static'
  },
  android: {
    package: 'org.bupasatsang.kitchen'
  }
};

export default config;
