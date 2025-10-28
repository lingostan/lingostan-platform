import type { StorybookConfig } from '@storybook/react-vite';
import { UserConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  staticDirs: [
    { from: '../assets', to: '/assets' }
  ],
  async viteFinal(config: UserConfig) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const rnProgressMock = path.resolve(__dirname, './mocks/react-native-progress.tsx');

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
      'react-native-progress': rnProgressMock
    };

    config.optimizeDeps = {
      ...(config.optimizeDeps || {}),
      include: [
        ...(config.optimizeDeps?.include || []),
        'react-native-web'
      ],
      esbuildOptions: {
        ...(config.optimizeDeps?.esbuildOptions || {}),
        loader: {
          // Treat .js files as JSX to support RN deps shipping JSX in .js
          '.js': 'jsx'
        }
      }
    };

    return config;
  }
};

export default config;


