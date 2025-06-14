import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log environment variables in development
  if (mode === 'development') {
    console.log('Environment variables:', {
      VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? 'Set' : 'Not set',
      VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    });
  }
  
  return {
    plugins: [react({
      jsxRuntime: 'automatic'
    })],
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
      target: 'esnext',
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
      include: ['react', 'react-dom', 'react/jsx-runtime'],
      exclude: ['index.dev.html']
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')
    }
  };
});