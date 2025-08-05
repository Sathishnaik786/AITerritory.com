import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import sitemap from 'vite-plugin-sitemap';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
