# Deployment Guide

## Architecture overview

```
Local dev:   React app  -->  Vite dev middleware /api/chat  -->  Anthropic API
                             (key from .env.local)

Production:  React app (Cloudflare Pages)  -->  Cloudflare Worker  -->  Anthropic API
             https://bydlo.pages.dev            (key as wrangler secret)
             						https://bydlo-api.vanek-erik.workers.dev
```

The frontend never touches the API key. It calls `/api/chat` (relative in dev, Worker URL in prod). The proxy adds the key server-side.

## Live URLs

| What | URL |
|------|-----|
| App (production) | https://bydlo.pages.dev |
| API proxy (Worker) | https://bydlo-api.vanek-erik.workers.dev |
| Cloudflare dashboard | https://dash.cloudflare.com — Workers & Pages |

## Environment files

| File | Purpose | Committed? |
|------|---------|------------|
| `.env.local` | `ANTHROPIC_API_KEY=sk-ant-...` for local dev | No (gitignored) |
| `.env.production` | `VITE_API_URL=https://bydlo-api.vanek-erik.workers.dev` | Yes (public URL, no secret) |

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

The Vite dev server has a built-in middleware at `/api/chat` that reads `ANTHROPIC_API_KEY` from `.env.local` and proxies to Anthropic. No Worker needed locally.

If `.env.local` is missing or has no key, the app falls back to mock responses (keyword pattern matching).

## Deploying the frontend (Cloudflare Pages)

```bash
# 1. Build (use npx vite build directly to skip tsc strict checks)
npx vite build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name bydlo --branch main --commit-dirty=true
```

The site will be live at https://bydlo.pages.dev within seconds.

### Why Cloudflare Pages instead of GitHub Pages?

The main GitHub Pages site (`erikvanek.github.io`) has a custom domain configured. GitHub applies that custom domain to ALL project repos, so `erikvanek.github.io/bydlo` redirected to `customdomain/bydlo` which broke routing. Cloudflare Pages gives a dedicated `bydlo.pages.dev` domain with no path prefix conflicts.

### Important: no vite.config.js

Only `vite.config.ts` should exist. If a `vite.config.js` appears (e.g. from an IDE transpile), delete it. Vite prioritizes `.js` over `.ts` and it will use stale settings.

## Deploying the API Worker

The Worker lives in `worker/` and is plain JS (no build step).

```bash
cd worker

# Deploy code changes
npx wrangler deploy

# Update the API key (interactive prompt, or pipe it in)
npx wrangler secret put ANTHROPIC_API_KEY
# Or non-interactive:
echo "sk-ant-..." | npx wrangler secret put ANTHROPIC_API_KEY
```

### Worker configuration

- **Config:** `worker/wrangler.toml` (name, entry point, compat date)
- **Secret:** `ANTHROPIC_API_KEY` set via `wrangler secret put` (never in toml or code)
- **CORS:** Allowed origins are hardcoded in `worker/index.js`:
  - `http://localhost:5173` (dev)
  - `http://localhost:4173` (preview)
  - `https://erikvanek.github.io` (legacy, can remove)
  - `https://bydlo.pages.dev` (production)

If you add a custom domain, add it to `ALLOWED_ORIGINS` in `worker/index.js` and redeploy.

### First-time Worker setup (for a new colleague)

```bash
cd worker
npx wrangler login               # Opens browser to auth with Cloudflare
npx wrangler secret put ANTHROPIC_API_KEY   # Paste the API key
npx wrangler deploy              # Deploy
```

You need access to the Cloudflare account that owns the `bydlo-api` Worker.

## Deploying both together (typical workflow)

```bash
# From project root
npx vite build
npx wrangler pages deploy dist --project-name bydlo --branch main --commit-dirty=true

# If Worker code also changed:
cd worker && npx wrangler deploy && cd ..
```

## Rotating the API key

1. Generate a new key at https://console.anthropic.com/settings/keys
2. Update local dev: edit `.env.local` with the new key
3. Update production Worker:
   ```bash
   cd worker
   echo "sk-ant-NEW-KEY-HERE" | npx wrangler secret put ANTHROPIC_API_KEY
   ```
4. Disable the old key in the Anthropic console

## How the LLM integration works

```
src/services/llmService.ts    -- frontend service
src/services/systemPrompt.ts  -- system prompts (grounded in actual designer data)
worker/index.js               -- production proxy
vite.config.ts                -- dev proxy (configureServer middleware)
```

- `llmService.ts` calls `${API_URL}/api/chat` with `{ system, messages, max_tokens }`
- `API_URL` = `VITE_API_URL` env var (empty in dev = relative URL, Worker URL in prod)
- If the API call fails with a network error, it falls back to mock responses
- The `[COMPLETE]` prefix in Claude's response signals the conversation is done
- `extractNeeds()` asks Claude to extract structured JSON from the conversation for matching

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "invalid x-api-key" on production | Worker secret is wrong/missing | `cd worker && npx wrangler secret put ANTHROPIC_API_KEY` |
| "API key not configured" on production | Worker secret not set at all | Same as above |
| CORS error on production | Origin not in `ALLOWED_ORIGINS` | Add origin to `worker/index.js`, redeploy Worker |
| Assets 404 / MIME type errors | Stale `vite.config.js` overriding `.ts` | Delete `vite.config.js`, rebuild, redeploy |
| Works locally, mock responses on prod | `VITE_API_URL` not set in build | Check `.env.production` exists before building |
| Hash routes not working | Using BrowserRouter | App uses HashRouter (`/#/conversation`) — this is correct for static hosting |
| `customdomain/bydlo` redirect | GitHub Pages custom domain conflict | Use Cloudflare Pages instead (current setup) |
