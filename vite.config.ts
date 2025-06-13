import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Cadence/',
  server: {
    port: 8080,
    strictPort: true,
    host: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'assets/index.[hash].css';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['index.dev.html']
  }
});