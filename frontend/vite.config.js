import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy WebSocket and API requests to the backend
      "/socket.io": {
        target: "http://localhost:3000", // Backend URL
        ws: true, // Enable WebSocket support
      },
      // "/api": {
      //   target: "http://localhost:3000", // Backend API endpoint
      //   changeOrigin: true, // Ensure the correct host is used
      // }
      
    },
  },
});
