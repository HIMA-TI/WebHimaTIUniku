import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const technoversaryStaticPlugin = {
  name: 'technoversary-static-server',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/technoversary' || req.url === '/technoversary/') {
        req.url = '/technoversary/index.html';
      }
      next();
    });
  },
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devProxyTarget = (env.DEV_API_PROXY_TARGET || '').replace(/\/+$/, '');

  const config = {
    plugins: [react(), tailwindcss(), technoversaryStaticPlugin],
  };

  // Dev-only proxy to avoid CORS and keep frontend API base as `/api`.
  // Supports DEV_API_PROXY_TARGET with or without trailing `/api`.
  if (devProxyTarget) {
    const targetHasApiPath = devProxyTarget.endsWith('/api');

    config.server = {
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
          secure: false,
          ...(targetHasApiPath ? { rewrite: (path) => path.replace(/^\/api/, '') } : {}),
        },
      },
    };
  }

  return config;
});
