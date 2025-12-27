import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public_html/assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        view: 'src/view/main.ts',
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
    },
  },
});
