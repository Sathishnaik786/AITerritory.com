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
      exclude: ['/auth/**', '/dashboard/**', '/settings/**'],
    }),
    viteCompression({ algorithm: 'brotliCompress' }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ssr: 'src/entry-server.jsx', // or .tsx if using TypeScript
    outDir: 'dist',
  },
}));
