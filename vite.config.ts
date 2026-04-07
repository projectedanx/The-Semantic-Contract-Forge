import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      /*
         Note: We avoid using the 'define' block to inject environment variables
         (like process.env.API_KEY) into the client bundle to prevent accidental
         leakage of secrets. Vite's built-in 'import.meta.env.VITE_*' mechanism
         is preferred for controlled exposure.
      */
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
