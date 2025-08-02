import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';
// import sitemap from 'vite-plugin-sitemap';
import viteCompression from 'vite-plugin-compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('🔧 Vite Config - Environment Variables:');
  console.log('VITE_CLERK_PUBLISHABLE_KEY:', env.VITE_CLERK_PUBLISHABLE_KEY);
  console.log('VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY);
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      // Explicitly define environment variables
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    server: {
      host: "localhost",
      port: 8080,
      hmr: {
        overlay: false
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      // sitemap({
      //   hostname: 'https://aiterritory.org',
      //   exclude: ['/auth/**', '/dashboard/**', '/settings/**'],
      // }),
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
  };
});
