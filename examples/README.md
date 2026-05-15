# Examples

Contoh implementasi `kode-wilayah-id` di berbagai framework dan runtime.

## Frontend

| File | Framework | Fitur |
|------|-----------|-------|
| [`react.tsx`](react.tsx) | React | Cascading dropdown + search component |
| [`nextjs.tsx`](nextjs.tsx) | Next.js | API route + server component + client component |
| [`vue.vue`](vue.vue) | Vue 3 | Cascading dropdown + search (Composition API) |
| [`nuxt.vue`](nuxt.vue) | Nuxt 3 | Server API + composable + page |
| [`svelte.svelte`](svelte.svelte) | Svelte 5 | Cascading dropdown + search (runes) |
| [`sveltekit.ts`](sveltekit.ts) | SvelteKit | Server load + API endpoint |
| [`angular.ts`](angular.ts) | Angular | Service + component (template-driven) |

## Backend

| File | Framework | Fitur |
|------|-----------|-------|
| [`express.ts`](express.ts) | Express.js | REST API lengkap |
| [`hono.ts`](hono.ts) | Hono | Lightweight REST API |
| [`bun.ts`](bun.ts) | Bun | Native Bun HTTP server |
| [`deno.ts`](deno.ts) | Deno | Native Deno server |

## General

| File | Runtime | Fitur |
|------|---------|-------|
| [`node.ts`](node.ts) | Node.js | Basic usage — semua fungsi API |

## Quick Start

```bash
# Install package
npm install kode-wilayah-id

# Run Node.js example
npx tsx examples/node.ts

# Run Express example
npm install express
npx tsx examples/express.ts

# Run Hono example
npm install hono @hono/node-server
npx tsx examples/hono.ts

# Run Bun example
bun examples/bun.ts

# Run Deno example
deno run --allow-net --allow-read examples/deno.ts
```
