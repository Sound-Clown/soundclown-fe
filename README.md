# SoundClown — Frontend

A SoundCloud-style music platform frontend. Listeners stream and like songs, artists upload tracks and manage albums, admins review songs and manage users.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand · TanStack Query · Axios · Zod · Bun.

## Getting Started

```bash
bun install
bun dev          # dev server at http://localhost:3000
```

Requires the API Gateway running at `http://localhost:8080` (configured in `.env.local`).

## Scripts

```bash
bun dev          # start dev server
bun run build    # production build
bun start        # start production server
bun run lint     # lint
```

## Architecture

- **API layer:** Axios instance (`src/lib/api.ts`) targets the API Gateway; all responses use the `{ code, message?, result? }` envelope (success = `1000`).
- **Data fetching:** TanStack Query (caching, dedupe, optimistic updates).
- **State:** Zustand stores for auth (persisted + cookie sync for middleware) and the audio player.
- **Rendering:** song/album detail pages are Hybrid RSC (server-rendered for SEO/OG share); the rest are client components.
- **Routing:** all authenticated areas live under a single `(app)` route group so the player/audio never remounts on navigation; role guards in `src/middleware.ts`.

See `.docs/frontend-design.md` and `.docs/api-docs.md` for full details.

## Troubleshooting

If `_next` assets 404 or you hit `Cannot find module './xxx.js'`, clear the build cache:

```bash
rm -rf .next && bun dev
```
