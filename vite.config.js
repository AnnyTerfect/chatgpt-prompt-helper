/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.jsx',
      userscript: {
        icon: 'https://chat.openai.com/favicon.ico',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://chatgpt.com/*'],
      },
      build: {
        externalGlobals: {
          /*
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),*/
        },
      },
    }),
    WindiCSS(),
  ],
  css: {
    preprocessorOptions: {
      sass: {},
      scss: {},
    },
  },
});
