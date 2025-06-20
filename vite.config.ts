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
      },
      // Proxy individual PHP files to XAMPP (for legacy endpoints)
      '/signup_submit.php': 'http://localhost/FYP_AeroTrav_Final',
      '/login_submit.php': 'http://localhost/FYP_AeroTrav_Final',
      '/search_hotels.php': 'http://localhost/FYP_AeroTrav_Final',
      '/search_flights.php': 'http://localhost/FYP_AeroTrav_Final',
      '/search_cars.php': 'http://localhost/FYP_AeroTrav_Final',
      '/search_packages.php': 'http://localhost/FYP_AeroTrav_Final',
      '/ai_itinerary.php': 'http://localhost/FYP_AeroTrav_Final',
      '/cart_add.php': 'http://localhost/FYP_AeroTrav_Final',
      '/cart_remove.php': 'http://localhost/FYP_AeroTrav_Final',
      '/cart_view.php': 'http://localhost/FYP_AeroTrav_Final',
      '/checkout_submit.php': 'http://localhost/FYP_AeroTrav_Final',
      '/test_cors.php': 'http://localhost/FYP_AeroTrav_Final',
      '/test_api_connection.php': 'http://localhost/FYP_AeroTrav_Final'
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