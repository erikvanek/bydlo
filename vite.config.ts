import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix), not just VITE_ ones
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    plugins: [
      react(),
      {
        name: 'api-chat-dev-proxy',
        configureServer(server) {
          // Dev-only proxy: same shape as the Cloudflare Worker
          // POST /api/chat → forward to Anthropic with local API key
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.writeHead(204)
              res.end()
              return
            }

            if (req.method !== 'POST') {
              res.writeHead(405, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const apiKey = env.ANTHROPIC_API_KEY
            if (!apiKey) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in .env.local' }))
              return
            }

            // Read request body
            const chunks: Buffer[] = []
            for await (const chunk of req) {
              chunks.push(chunk as Buffer)
            }
            const body = JSON.parse(Buffer.concat(chunks).toString())

            try {
              const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': apiKey,
                  'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                  model: body.model || 'claude-sonnet-4-20250514',
                  max_tokens: body.max_tokens || 512,
                  system: body.system || '',
                  messages: body.messages,
                }),
              })

              const responseText = await anthropicRes.text()
              res.writeHead(anthropicRes.status, { 'Content-Type': 'application/json' })
              res.end(responseText)
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: (err as Error).message }))
            }
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
