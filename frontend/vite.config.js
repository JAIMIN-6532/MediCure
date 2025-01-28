import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy WebSocket and API requests to the backend
      "/socket.io": {
        target: "https://medicure-go5v.onrender.com", // Backend URL https://medicure-go5v.onrender.com
        ws: true, // Enable WebSocket support
      },
      "/": {
        target: "https://medicure-go5v.onrender.com", // Backend API endpoint
        changeOrigin: true, // Ensure the correct host is used
      }
      
    },
  },
});
