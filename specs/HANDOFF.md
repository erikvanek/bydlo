# Session handoff

**Purpose:** After each coding session (Claude Code, Gemini CLI, Cursor, etc.), update this file so the next session or tool has context without re-explaining the project.

---

## Last updated

2026-02-07

---

## What was done

- **Landing page redesign:** Bold typography, inline situation textarea, quick-action scenario buttons, featured consultants grid, muted "How it works" sidebar
- **Real Claude API integration:** `llmService.ts` calls Claude via proxy, with mock fallback. System prompts grounded in actual designer data (cities, rates, specialties)
- **API key security:** Removed direct browser calls. API key never reaches the frontend. Dev uses Vite middleware proxy, prod uses Cloudflare Worker
- **Cloudflare Worker:** `worker/index.js` — thin proxy holding API key as secret, forwards to Anthropic, CORS for allowed origins
- **Cloudflare Pages deployment:** Frontend hosted at `https://bydlo.pages.dev` (replaced GitHub Pages due to custom domain conflict)
- **Bug fixes:** StrictMode double-fire guard, system prompt passed on all turns, initial description included in follow-up history
- **Conversation flow:** `[COMPLETE]` prefix signals end of conversation, triggers needs extraction and designer matching
- **HashRouter:** For static hosting compatibility (no server-side routing)

---

## What's pending

- **TypeScript strict build:** `npm run build` (which runs `tsc -b`) has pre-existing errors in DesignerProfile.tsx, FilterBar.tsx, dialog.tsx. Workaround: use `npx vite build` directly
- **CI/CD:** No automated deployment yet. Manual `npx wrangler pages deploy` for now. Could add GitHub Actions
- **Custom domain:** Could add a custom domain to Cloudflare Pages if desired (e.g. `bydlo.yourdomain.com`)
- **Rate limiting:** The Worker has no rate limiting. Consider adding if exposed publicly long-term
- **Conversation polish:** Claude sometimes gives longer responses than ideal for a matchmaking chatbot

---

## Decisions and notes

- **Cloudflare Pages over GitHub Pages:** GitHub Pages custom domain on the main repo caused `/bydlo/` path to redirect to `customdomain/bydlo`. Cloudflare Pages gives a clean `bydlo.pages.dev` URL
- **HashRouter:** Required for static hosting (CF Pages, GH Pages). Routes look like `/#/conversation`
- **`vite.config.ts` only:** Delete `vite.config.js` if it appears — Vite prioritizes `.js` over `.ts` and will use stale settings
- **Mock fallback:** If the API proxy is unreachable (network TypeError), the app falls back to mock keyword-matching responses. This is intentional for offline/demo use
- **`base: '/'`:** Vite base is root `/` for all environments (Cloudflare Pages serves at root)

---

## How to resume

```bash
# Local dev
npm run dev

# Deploy frontend
npx vite build && npx wrangler pages deploy dist --project-name bydlo --branch main --commit-dirty=true

# Deploy Worker (if worker/index.js changed)
cd worker && npx wrangler deploy
```

See `DEPLOYMENT.md` for full deployment guide, troubleshooting, and key rotation.
