# Penarchy Studio

A premium black-luxury ecommerce platform for handcrafted Damascus steel,
brass and copper objects, built with Next.js (App Router), TypeScript,
Tailwind CSS v4, Prisma/PostgreSQL, and Auth.js.

## 1. Project structure

```
app/                      Routes (App Router)
  admin/                   Admin dashboard (auth-gated, role=ADMIN)
  product/[slug]/          Product detail pages
  shop/, shop/[category]/  Catalog + category browsing
  collections/, [slug]/    Curated collections
  cart/, checkout/         Cart + multi-step checkout
  account/, login/, register/, forgot-password/
  api/                     Route handlers (auth, contact, register)
  sitemap.ts, robots.ts    Technical SEO
components/
  layout/                  Header, Footer
  home/                    Hero, craftsmanship, product grids, process
  product/                 ProductCard, gallery, accordion, add-to-cart
  cart/                    Cart drawer
  admin/                   Admin product table + form
  ui/                      Shared primitives (empty states, prose page)
lib/
  data/                    Repository (data access) + seed data
  store/                   Zustand cart store
  payments/                Payment provider abstraction (Stripe/PayPal/COD/etc.)
  email/                   Email provider abstraction
  auth/                    Auth.js configuration
  validation/              Zod schemas
prisma/schema.prisma       Full relational schema
docker-compose.yml         Local Postgres
scripts/                   Import tooling (see Section 8)
```

## 2. Current data layer — important

`npx prisma generate` needs to download engine binaries from
`binaries.prisma.sh`. In the sandbox this project was built in, that host is
blocked by the network egress policy, so Prisma's client could not be
generated there. To keep the app fully functional in that environment,
`lib/data/repository.ts` implements a **mock provider**: the same exported
function signatures a Prisma-backed provider would have, backed by an
in-memory store seeded from `lib/data/*-seed.ts`.

**On your own machine, with normal internet access, switch to real Postgres:**

```bash
npm install
docker compose up -d
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Then replace the bodies of the functions in `lib/data/repository.ts` with
`prisma.*` calls — the function signatures are already the contract the UI
codes against, so no component changes should be required.

## 3. Environment variables

Copy `.env.example` to `.env` and fill in real values. See that file for the
full list (database, Auth.js secret, payment provider keys, email provider,
media storage, analytics IDs).

## 4. Local development

```bash
npm install
docker compose up -d          # starts Postgres
npx prisma migrate dev        # creates tables
npx prisma db seed            # loads categories + verified products
npm run dev                   # http://localhost:3000
```

## 5. Admin account

A mock admin user is configured in `lib/auth/index.ts` for demo purposes:

- Email: `admin@penarchystudio.com`
- Password: `changeme123`

**Rotate this immediately in any real deployment.** Once Prisma is wired up,
replace the mock user store with `prisma.user.findUnique(...)` and create
real admin accounts via a seed script or `/admin` invite flow.

## 6. Real product data

Four products were migrated from the live BladesAndBeyonds Etsy shop with
verified facts (name, price, materials, dimensions) pulled directly from the
listings — see `lib/data/products-seed.ts`. Images currently reference
Etsy's CDN directly; replace with locally-hosted, rights-cleared copies via
the Media Library once built out, or via `/scripts/import-products.ts`.

No specifications were invented for these four items. The remaining ~70 SKUs
implied by the category counts in the brief were **not** seeded with
placeholder data, since that would mean fabricating materials/dimensions —
run the importer (below) against your real export instead.

## 7. Categories

The 12 categories from the brief are seeded in `lib/data/categories-seed.ts`
and are fully admin-editable in production (create/rename/reorder via
`adminCreateCategory` / `adminUpdateCategory` / `adminDeleteCategory` in the
repository) — nothing is hardcoded into the storefront.

## 8. Importing your full Etsy catalog

`scripts/import-products.ts` is the entry point for a real migration. It
expects a JSON or CSV export plus an image folder, and is designed to be
rerun safely (it dedupes on `sourceId`/SKU, so running it twice won't
duplicate products). See the comments at the top of that file for the exact
expected input shape. Etsy's own site isn't reachable from network-restricted
sandboxes — export your listings (Etsy's Shop Manager, Settings, Options,
Download Data — or a manual CSV) and run the script locally.

## 9. Payments

`lib/payments/index.ts` is a provider-agnostic abstraction. Only one
provider is "live" today: `manual` / `cod` / `bank_transfer`, which don't
need external credentials. Stripe and PayPal have the correct interface
stubbed in — add `STRIPE_SECRET_KEY` / `PAYPAL_CLIENT_ID` etc. to `.env` and
fill in the commented SDK calls to activate them. **No provider secret ever
ships to the client** — this file is only ever imported from Server Actions
/ Route Handlers.

## 10. Email

`lib/email/index.ts` defaults to a `console` provider (logs instead of
sending) so nothing breaks locally. Swap `EMAIL_PROVIDER` in `.env` and
implement the SMTP/Resend branch to send real transactional email.

## 11. Deployment

This is a standard Next.js app — deploy to Vercel, or any Node host that
supports the App Router. Point `DATABASE_URL` at a real managed Postgres
instance, run `prisma migrate deploy` in your CI/CD pipeline, and set the
remaining environment variables from `.env.example`.

## 12. What remains dependent on external credentials/data you provide

- A real, complete product catalog (only 4 verified SKUs are seeded)
- Rights-cleared local product photography (currently referencing Etsy's CDN)
- Stripe/PayPal live keys to accept real payments
- A transactional email provider (SMTP or Resend API key)
- Real social media handles for the footer (intentionally left blank)
- Legal review of the Privacy Policy / Terms placeholder content
- A production Postgres instance, with `prisma migrate deploy` run against it
- Fonts: this sandbox couldn't reach fonts.googleapis.com, so
  Cormorant Garamond / Inter currently fall back to system font stacks in
  `app/globals.css`. Restore `next/font/google` in `app/layout.tsx` (commented
  inline) once deployed somewhere with normal internet access.
