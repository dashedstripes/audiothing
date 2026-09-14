# AGENTS.md

AudioThing web app — Next.js 16 (App Router) + embedded Sanity Studio.

## Stack

- Next.js 16 with **Cache Components** enabled (`cacheComponents: true` in `next.config.ts`).
- `next-sanity` v13 with Sanity Live (`defineLive`).
- Embedded Sanity Studio mounted at `/studio`.
- i18n via `[lang]` route segment (`en`, `es`), redirected by `middleware.ts`.

## Cache Components rules

This app uses `cacheComponents: true`. The key constraints:

- Dynamic APIs (`cookies()`, `headers()`, `await params`, `await searchParams`) are **forbidden** inside a function carrying `'use cache'`. `draftMode()` is the one allowed exception.
- Data fetching for Sanity goes through `sanityFetch` from `@/sanity/live`, called only inside `'use cache'` functions, and `perspective` / `stega` must be passed in as props — never hardcoded.
- Resolve `perspective` / `stega` with `getDynamicFetchOptions()` (reads cookies + draftMode) outside the cache boundary.
- `<SanityLive>` and `<VisualEditing>` are rendered exactly once, in `app/[lang]/layout.tsx`.

## Three-layer page pattern

Every data-driven route follows:

1. **Page/Layout** — branches on `draftMode()`. Not in draft → render the cached component directly with `perspective="published" stega={false}`. In draft → render a `<Suspense>` wrapping the dynamic component.
2. **Dynamic component** — awaits `params` + `getDynamicFetchOptions()`, forwards plain props down.
3. **Cached component** — carries `'use cache'`, receives `perspective`/`stega` as props, calls `sanityFetch`.

## Helpers (`@/sanity/live`)

- `sanityFetch` — inside `'use cache'` components.
- `sanityFetchMetadata` — inside `generateMetadata` etc.
- `sanityFetchStaticParams` — inside `generateStaticParams` only.
- `getDynamicFetchOptions` — resolve `perspective`/`stega` outside the cache boundary.

## Dev / build

- `npm run dev` — local dev (Turbopack).
- `npm run build` — production build.
- `npm run lint` — ESLint.
