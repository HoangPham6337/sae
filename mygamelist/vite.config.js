import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'], // Résout automatiquement .js et .jsx
  },
  server: {
    port: 3000,
  },
});
