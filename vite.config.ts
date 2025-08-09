import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import sitemap from 'vite-plugin-sitemap';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Bind explicitly to localhost for Windows/Firefox stability
    host: "localhost",
    port: 8080,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 8080,
    },
    proxy: {
      '/api': 'http://localhost:3003',
    },
  },
  plugins: [
    react(),
    sitemap({
      hostname: 'https://aiterritory.org',
      exclude: [
        '/auth/**', 
        '/dashboard/**', 
        '/settings/**',
        '/resources/best-ai-3d-generators',
        '/company/update-tool',
        '/company/skill-leap',
        '/categories/art-generators',
        '/categories/audio-generators'
      ],
    }),
    viteCompression({ algorithm: 'brotliCompress' }),
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: '@tanstack/react-query',
        replacement: path.resolve(__dirname, 'node_modules/@tanstack/react-query')
      }
    ],
    // Ensure singletons to avoid multiple React/Router instances in dev
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['@tanstack/react-query'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
}));
