import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devProxyTarget = env.DEV_API_PROXY_TARGET;

  const config = {
    plugins: [react(), tailwindcss()],
  };

  // Dev-only proxy to avoid CORS and keep frontend API base as `/api`.
  if (devProxyTarget) {
    config.server = {
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    };
  }

  return config;
});
