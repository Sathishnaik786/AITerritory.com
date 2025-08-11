// vite.config.ts
import { defineConfig } from "file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import sitemap from "file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/node_modules/vite-plugin-sitemap/dist/index.js";
import viteCompression from "file:///C:/Users/sathi/OneDrive/Desktop/AITerritory.com/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\sathi\\OneDrive\\Desktop\\AITerritory.com";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    // Bind explicitly to localhost for Windows/Firefox stability
    host: "localhost",
    port: 8080,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 8080
    },
    proxy: {
      "/api": "http://localhost:3003"
    }
  },
  plugins: [
    react(),
    sitemap({
      hostname: "https://aiterritory.org",
      exclude: [
        "/auth/**",
        "/dashboard/**",
        "/settings/**",
        "/resources/best-ai-3d-generators",
        "/company/update-tool",
        "/company/skill-leap",
        "/categories/art-generators",
        "/categories/audio-generators"
      ]
    }),
    viteCompression({ algorithm: "brotliCompress" })
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__vite_injected_original_dirname, "./src")
      },
      {
        find: "@tanstack/react-query",
        replacement: path.resolve(__vite_injected_original_dirname, "node_modules/@tanstack/react-query")
      }
    ],
    // Ensure singletons to avoid multiple React/Router instances in dev
    dedupe: ["react", "react-dom", "react-router", "react-router-dom"]
  },
  optimizeDeps: {
    include: ["@tanstack/react-query"]
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "index.html")
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzYXRoaVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXEFJVGVycml0b3J5LmNvbVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc2F0aGlcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxBSVRlcnJpdG9yeS5jb21cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3NhdGhpL09uZURyaXZlL0Rlc2t0b3AvQUlUZXJyaXRvcnkuY29tL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHNpdGVtYXAgZnJvbSAndml0ZS1wbHVnaW4tc2l0ZW1hcCc7XG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIC8vIEJpbmQgZXhwbGljaXRseSB0byBsb2NhbGhvc3QgZm9yIFdpbmRvd3MvRmlyZWZveCBzdGFiaWxpdHlcbiAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBobXI6IHtcbiAgICAgIHByb3RvY29sOiAnd3MnLFxuICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICBjbGllbnRQb3J0OiA4MDgwLFxuICAgIH0sXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMycsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgc2l0ZW1hcCh7XG4gICAgICBob3N0bmFtZTogJ2h0dHBzOi8vYWl0ZXJyaXRvcnkub3JnJyxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJy9hdXRoLyoqJywgXG4gICAgICAgICcvZGFzaGJvYXJkLyoqJywgXG4gICAgICAgICcvc2V0dGluZ3MvKionLFxuICAgICAgICAnL3Jlc291cmNlcy9iZXN0LWFpLTNkLWdlbmVyYXRvcnMnLFxuICAgICAgICAnL2NvbXBhbnkvdXBkYXRlLXRvb2wnLFxuICAgICAgICAnL2NvbXBhbnkvc2tpbGwtbGVhcCcsXG4gICAgICAgICcvY2F0ZWdvcmllcy9hcnQtZ2VuZXJhdG9ycycsXG4gICAgICAgICcvY2F0ZWdvcmllcy9hdWRpby1nZW5lcmF0b3JzJ1xuICAgICAgXSxcbiAgICB9KSxcbiAgICB2aXRlQ29tcHJlc3Npb24oeyBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogJ0AnLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbmQ6ICdAdGFuc3RhY2svcmVhY3QtcXVlcnknLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9AdGFuc3RhY2svcmVhY3QtcXVlcnknKVxuICAgICAgfVxuICAgIF0sXG4gICAgLy8gRW5zdXJlIHNpbmdsZXRvbnMgdG8gYXZvaWQgbXVsdGlwbGUgUmVhY3QvUm91dGVyIGluc3RhbmNlcyBpbiBkZXZcbiAgICBkZWR1cGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlcicsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyxvQkFBb0I7QUFDeFcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxxQkFBcUI7QUFKNUIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUE7QUFBQSxJQUVOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLEtBQUs7QUFBQSxNQUNILFVBQVU7QUFBQSxNQUNWLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGdCQUFnQixFQUFFLFdBQVcsaUJBQWlCLENBQUM7QUFBQSxFQUNqRCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDOUM7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxvQ0FBb0M7QUFBQSxNQUMzRTtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsUUFBUSxDQUFDLFNBQVMsYUFBYSxnQkFBZ0Isa0JBQWtCO0FBQUEsRUFDbkU7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxFQUNuQztBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzVDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
