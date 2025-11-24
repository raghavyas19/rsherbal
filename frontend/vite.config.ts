import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor_framer_motion';
            if (id.includes('lucide-react')) return 'vendor_lucide';
            if (id.includes('react')) return 'vendor_react';
            return 'vendor';
          }
        }
      }
    }
  }
});
