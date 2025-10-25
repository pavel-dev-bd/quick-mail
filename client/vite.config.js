import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log('Loaded env:', env); // 🧠 Debugging output

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME),
    },
     server: {
     port: 3000,
      },
      build: {
        outDir: 'dist',
      },
      define: {
        'process.env': {}
      }
  };
});
