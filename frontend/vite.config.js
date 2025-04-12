import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy WebSocket and API requests to the backend
      "/socket.io": {
        target: "https://api.medicure.help/", // Backend URL https://medicure-go5v.onrender.com    https://api.medicure.help/
        ws: true, // Enable WebSocket support
      },
      // "/": {
      //   target: "http://localhost:3000", // Backend API endpoint
      //   changeOrigin: true, // Ensure the correct host is used
      // }
      
    },
  },
});




