import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AI Territory',
        short_name: 'AITerritory',
        description: 'Discover and share AI tools',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog'],
        },
        // Add cache-busting for production builds
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
    // Add CSS optimization to prevent layout flash
    cssCodeSplit: false,
    assetsInlineLimit: 4096,
    // Ensure proper module format
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
    },
    // Improve CSS handling
    css: {
      preprocessorOptions: {
        css: {
          charset: false
        }
      },
      // Add postcss config for better CSS processing
      postcss: {
        plugins: [
          // Add any postcss plugins you might be using
        ]
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
    headers: mode === 'development' ? {
      'Content-Security-Policy': [
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*;",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://www.googletagmanager.com;",
        "style-src 'self' 'unsafe-inline' http://localhost:* https://fonts.googleapis.com;",
        "img-src 'self' data: blob: http: https:;",
        "font-src 'self' data: http: https:;",
        "connect-src 'self' http://localhost:* https://www.google-analytics.com https://aiterritory-com.onrender.com https://ckahkadgnaxzcfhmsdaj.supabase.co wss://ckahkadgnaxzcfhmsdaj.supabase.co;",
        "frame-src 'self' http://localhost:* https://docs.google.com;",
        "worker-src 'self' blob:;",
      ].join(' '),
    } : {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "img-src 'self' data: blob: http: https:;",
        "font-src 'self' data: https://fonts.gstatic.com;",
        "connect-src 'self' https://www.google-analytics.com https://aiterritory-com.onrender.com https://ckahkadgnaxzcfhmsdaj.supabase.co wss://ckahkadgnaxzcfhmsdaj.supabase.co;",
        "frame-src 'self' https://docs.google.com;",
        "worker-src 'self' blob:;",
      ].join(' '),
    },
  },
  preview: {
    port: 3009,
    strictPort: false,
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "img-src 'self' data: blob: http: https:;",
        "font-src 'self' data: https://fonts.gstatic.com;",
        "connect-src 'self' https://www.google-analytics.com https://aiterritory-com.onrender.com https://ckahkadgnaxzcfhmsdaj.supabase.co wss://ckahkadgnaxzcfhmsdaj.supabase.co;",
        "frame-src 'self' https://docs.google.com;",
        "worker-src 'self' blob:;",
      ].join(' ')
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Add cache-busting for development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Ensure ES module compatibility
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  // Ensure proper ES module handling
  esbuild: {
    define: {
      global: 'globalThis',
    },
  },
}));