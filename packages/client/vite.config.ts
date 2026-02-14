import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.IS_PREACT': JSON.stringify('false'),
  },
  server: {
    port: 5173,
    proxy: {
      '/ws': { target: 'ws://localhost:3001', ws: true },
      '/api': { target: 'http://localhost:3001' },
    },
  },
});
