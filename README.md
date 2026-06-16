# SaaS Starter Kit

Monorepo template for full-stack SaaS applications. Click **Use this template** to start a new project with auth, email, dark mode, i18n, and Railway + Cloudflare Pages deployment wired up from day one.

## What you get

- **Magic-link auth** — passwordless email → token → httpOnly session cookie, ready to go
- **Users domain** — registration, profile edit, account deletion
- **Dark mode** — CSS variables + anti-FOUC, no flicker on load
- **i18n** — English + pt-BR out of the box, easy to extend
- **Feature flags** — env-driven: toggle auth, registration, legal pages without code changes
- **Dev mode** — magic links printed to console, SQLite, no external services needed
- **Production-ready deploy** — Railway (API) + Cloudflare Pages (web), or Docker self-hosted

## Stack

| Layer   | Technology                                      |
|---------|-------------------------------------------------|
| API     | Fastify 5 · Kysely · SQLite / PostgreSQL · Zod  |
| Web     | React 19 · Vite 6 · Tailwind CSS 4 · i18next   |
| Auth    | Magic link (email-based, passwordless)          |
| Email   | Resend (HTTP) or any SMTP provider              |
| Deploy  | Railway (API) + Cloudflare Pages (web) or Docker |

---

## Using this template

### 1. Create your repository

Click **Use this template → Create a new repository**, or via CLI:

```bash
gh repo create my-app --template Bryant-Anjos/saas-starter-kit --private --clone
cd my-app
```

### 2. Update the name and branding

| File | What to change |
|------|----------------|
| `web/src/i18n/en.ts` | `app.name`, legal text, footer copyright |
| `web/src/i18n/pt-BR.ts` | Same in Portuguese |
| `web/index.html` | Title, meta description, OG tags, canonical URL |
| `web/public/site.webmanifest` | App name, description |
| `web/public/favicon.svg` | Your logo |
| `web/public/og-image.svg` | Social sharing image |
| `web/public/robots.txt` | Your domain |
| `web/public/sitemap.xml` | Your URLs |
| `api/src/services/emailTranslations.ts` | `APP_NAME` constant (or set via env var) |

### 3. Start developing

```bash
npm install
cp api/.env.example api/.env
npm run dev
# API → http://localhost:3001
# Web → http://localhost:5173
```

Magic links are printed to the API console in dev — no email provider needed.

### 4. Add your domain

- Backend routes go in `api/src/index.ts` and `api/src/routes/`
- Frontend routes and pages go in `web/src/App.tsx` and `web/src/pages/`
- Database tables go in `api/src/db/schema.ts` and a new migration file

---

## Development

### Local (SQLite, no external services)

```bash
npm install
cp api/.env.example api/.env
npm run dev
```

### With Docker (PostgreSQL + MailHog)

```bash
docker compose -f docker-compose.dev.yml up -d
# PostgreSQL → localhost:5432
# MailHog UI → http://localhost:8025
```

Update `api/.env`:

```
DATABASE_PROVIDER=postgres
DATABASE_URL=postgres://starter_app:starter_app@localhost:5432/starter_app
SMTP_HOST=localhost
SMTP_PORT=1025
```

---

## Feature flags

All flags are environment variables — no remote config, no runtime overhead.

### Backend (`api/.env`)

| Variable              | Default | Description                                      |
|-----------------------|---------|--------------------------------------------------|
| `ENABLE_AUTH`         | `true`  | Enables auth endpoints                           |
| `ENABLE_REGISTRATION` | `true`  | Allows new sign-ups (existing users still log in) |
| `MAINTENANCE_MODE`    | `false` | Blocks all write operations                      |

### Frontend (`web/.env.local`)

| Variable                   | Default | Description             |
|----------------------------|---------|-------------------------|
| `VITE_ENABLE_PRIVACY_PAGE` | `true`  | Show `/privacy` route   |
| `VITE_ENABLE_TERMS_PAGE`   | `true`  | Show `/terms` route     |
| `VITE_ENABLE_SUPPORT_PAGE` | `false` | Show `/support` route   |

---

## Authentication

Magic link is the only implemented provider. The structure supports adding OAuth or password auth without changing the session layer:

```
api/src/auth/
├── types.ts                   # MagicLinkProvider, OAuthProvider, PasswordProvider interfaces
└── providers/
    ├── magic-link/index.ts    # Implemented
    ├── google/index.ts        # Stub — implement OAuthProvider
    ├── github/index.ts        # Stub — implement OAuthProvider
    └── password/index.ts      # Stub — implement PasswordProvider
```

To add a new provider:
1. Implement the interface from `api/src/auth/types.ts`
2. Wire it into `AuthService.ts`
3. Add the route in `api/src/routes/auth.ts`

---

## Database

Two engines, toggled via `DATABASE_PROVIDER`:

| Value      | When to use                       | Config needed    |
|------------|-----------------------------------|------------------|
| `sqlite`   | Development, single-server deploy | `DATABASE_PATH`  |
| `postgres` | Production, multi-instance deploy | `DATABASE_URL`   |

Migrations run automatically at startup. To add a migration:
1. Create `api/src/db/migrations/000N_your_migration.ts`
2. Register it in `api/src/db/migrator.ts`

---

## Deployment

See [`docs/getting-started.md`](docs/getting-started.md) for step-by-step instructions.

### Railway (API) + Cloudflare Pages (web)

**Railway:**
- Uses `Dockerfile.api`
- Health check: `GET /api/health`
- Set env vars from `.env.prod.example` in the Railway dashboard

**Cloudflare Pages:**
- Build command: `npm run build --workspace=web`
- Output directory: `web/dist`
- Set `API_URL` to your Railway service URL
- `functions/api/[[path]].js` proxies `/api/*` to the backend automatically

### Docker (self-hosted)

```bash
cp .env.prod.example .env.prod
# Edit .env.prod with real values
docker compose --env-file .env.prod up -d --build
```

---

## Extending

### Add a language

1. Create `web/src/i18n/fr.ts` (copy `en.ts` structure, translate values)
2. Register it in `web/src/i18n/index.ts`
3. Add `{ code: 'fr', label: 'Français', short: 'FR' }` to `LanguageSwitcher.tsx`
4. Add email translations to `api/src/services/emailTranslations.ts`

### Add a theme

Add a `[data-theme="your-theme"]` block to `web/src/index.css` overriding the CSS variables defined in the `:root` block.
