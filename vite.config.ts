import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix), not just VITE_ ones
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-key-dev-server',
        configureServer(server) {
          // Serve API key at runtime during dev only — never bundled into builds
          server.middlewares.use('/api/config', (_req, res) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ apiKey: env.ANTHROPIC_API_KEY || null }))
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
