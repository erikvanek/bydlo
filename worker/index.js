/**
 * Bydlo API Proxy — Cloudflare Worker
 *
 * Proxies requests from the frontend to the Anthropic Claude API,
 * keeping the API key secret on the server side.
 *
 * Setup:
 *   npx wrangler secret put ANTHROPIC_API_KEY
 *   npx wrangler deploy
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://erikvanek.github.io',
  'https://bydlo.pages.dev',
]

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin)

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    // Only accept POST to /api/chat
    const url = new URL(request.url)
    if (request.method !== 'POST' || url.pathname !== '/api/chat') {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    // Validate API key is configured
    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    try {
      const body = await request.json()
      const { system, messages, max_tokens } = body

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'messages array is required' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' },
        })
      }

      // Forward to Anthropic
      const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: max_tokens || 512,
          system: system || '',
          messages,
        }),
      })

      const responseBody = await anthropicResponse.text()

      return new Response(responseBody, {
        status: anthropicResponse.status,
        headers: {
          ...cors,
          'Content-Type': 'application/json',
        },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }
  },
}
