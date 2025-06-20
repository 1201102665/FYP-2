import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      // Proxy API routes to Node.js backend server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
      // All legacy PHP endpoints removed - now handled by Node.js /api/* routes
      // ✅ /signup_submit.php → /api/auth/register
      // ✅ /login_submit.php → /api/auth/login
      // ✅ /search_hotels.php → /api/search/hotels
      // ✅ /search_flights.php → /api/search/flights
      // ✅ /search_cars.php → /api/search/cars
      // ✅ /search_packages.php → /api/search/packages
      // ✅ /ai_itinerary.php → /api/packages/ai-itinerary
      // ✅ /cart_add.php → /api/cart/add
      // ✅ /cart_remove.php → /api/cart/remove
      // ✅ /cart_view.php → /api/cart
      // ✅ /checkout_submit.php → /api/bookings/checkout
    }
  },
  plugins: [
  react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
}));