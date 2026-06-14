# SoundClown — Frontend

A SoundCloud-style music streaming web app. Listeners stream, search and like songs;
artists upload tracks and manage albums; admins review songs and manage users.

- **Live demo:** https://soundclown.vercel.app/
- **Backend (microservices):** https://github.com/Sound-Clown/soundclown-services

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Zustand ·
TanStack Query · Axios · Zod · Bun.

## Screenshots

### Home & player

![Home](.github/screenshots/ui-home.png)

![Now playing](.github/screenshots/ui-nowplaying.png)

### Listener

| Song detail & player                         | Search                                    |
| -------------------------------------------- | ----------------------------------------- |
| ![Song detail](.github/screenshots/ui-song.png) | ![Search](.github/screenshots/ui-search.png) |

| Album detail                            | Liked songs                                     |
| --------------------------------------- | ----------------------------------------------- |
| ![Album](.github/screenshots/ui-album.png) | ![Favorites](.github/screenshots/ui-favorites.png) |

| Artists                                     | Artist page                               |
| ------------------------------------------- | ----------------------------------------- |
| ![Artists](.github/screenshots/ui-artists.png) | ![Artist](.github/screenshots/ui-artist.png) |

### Artist

| Upload                                    | My songs                                          |
| ----------------------------------------- | ------------------------------------------------- |
| ![Upload](.github/screenshots/ui-upload.png) | ![My songs](.github/screenshots/ui-artist-songs.png) |

| My albums                                           | Stats                                   |
| --------------------------------------------------- | --------------------------------------- |
| ![My albums](.github/screenshots/ui-artist-albums.png) | ![Stats](.github/screenshots/ui-stats.png) |

### Admin

| Review queue                                   | Reject with reason                              |
| ---------------------------------------------- | ----------------------------------------------- |
| ![Review](.github/screenshots/ui-admin-songs.png) | ![Reject](.github/screenshots/ui-admin-review.png) |

| User management                               |     |
| --------------------------------------------- | --- |
| ![Users](.github/screenshots/ui-admin-users.png) |     |

### Authentication

| Login                                   | Register                                      |
| --------------------------------------- | --------------------------------------------- |
| ![Login](.github/screenshots/ui-login.png) | ![Register](.github/screenshots/ui-register.png) |

## Getting Started

```bash
bun install
bun dev          # dev server at http://localhost:3000
```

Requires the API Gateway reachable at the URL in `.env.local` (`NEXT_PUBLIC_API_URL`).

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
- **State:** Zustand stores for auth (persisted + cookie sync for the route proxy) and the audio player.
- **Rendering:** song/album detail pages are Hybrid RSC (server-rendered for SEO/OG share); the rest are client components.
- **Routing:** all authenticated areas live under a single `(app)` route group so the player/audio never remounts on navigation; role guards in `src/proxy.ts` (Next 16 renamed `middleware` → `proxy`).
- **Player:** a single persistent `<audio>` element mounted once, with Media Session support.

## Troubleshooting

If `_next` assets 404 or you hit `Cannot find module './xxx.js'`, clear the build cache:

```bash
rm -rf .next && bun dev
```
