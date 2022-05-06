// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import { resolve } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});
