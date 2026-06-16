# SaaS Starter Kit

An opinionated monorepo starter for full-stack SaaS applications. Extracted from a production project and kept deliberately simple.

## Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| API       | Fastify 5 · Kysely · SQLite / PostgreSQL · Zod  |
| Web       | React 19 · Vite 6 · Tailwind CSS 4 · i18next   |
| Auth      | Magic links (email-based, passwordless)         |
| Email     | Resend (HTTP) or any SMTP provider              |
| Deploy    | Railway (API) + Cloudflare Pages (Web) or Docker |

## Architecture

```
saas-starter-kit/
├── api/                        # Fastify backend
│   └── src/
│       ├── auth/               # Auth module
│       │   ├── types.ts        # Provider interfaces (MagicLink, OAuth, Password)
│       │   └── providers/
│       │       ├── magic-link/ # Implemented: email → token → session
│       │       ├── google/     # Stub: OAuth extension point
│       │       ├── github/     # Stub: OAuth extension point
│       │       └── password/   # Stub: password extension point
│       ├── db/                 # Kysely setup + migrations
│       ├── plugins/            # Fastify plugins (auth, maintenance)
│       ├── repositories/       # Data access layer (UserRepository)
│       ├── routes/             # HTTP handlers (auth, me)
│       └── services/           # Business logic (AuthService, UserService, email)
└── web/                        # React frontend
    └── src/
        ├── components/         # Layout, Footer, UserMenu, Modal, etc.
        ├── hooks/              # useAuth, useTheme, usePageMeta, usePageTitle
        ├── i18n/               # English + pt-BR translations
        ├── lib/                # API client, utils, pixBrCode
        └── pages/              # LoginPage, AuthVerifyPage, DashboardPage, legal pages
```

## Quick Start

### Prerequisites

- Node.js 22+
- npm 10+

### Development

```bash
# 1. Clone and install
git clone <your-repo>
cd saas-starter-kit
npm install

# 2. Configure the API
cp api/.env.example api/.env
# Edit api/.env — defaults work out of the box with SQLite in dev

# 3. Configure the web (optional)
cp web/.env.example web/.env.local

# 4. Start both services
npm run dev
# API → http://localhost:3001
# Web → http://localhost:5173
```

In development mode, magic links are printed to the API console — no email provider needed.

### With Docker (PostgreSQL + MailHog)

```bash
docker compose -f docker-compose.dev.yml up -d
# PostgreSQL → localhost:5432
# MailHog UI → http://localhost:8025

# Set in api/.env:
# DATABASE_PROVIDER=postgres
# DATABASE_URL=postgres://starter_app:starter_app@localhost:5432/starter_app
# SMTP_HOST=localhost
# SMTP_PORT=1025

npm run dev
```

## Feature Flags

All flags are environment-driven — no remote config, no runtime overhead.

### Backend (`api/.env`)

| Variable              | Default | Description                                |
|-----------------------|---------|--------------------------------------------|
| `ENABLE_AUTH`         | `true`  | Enables the auth endpoints                 |
| `ENABLE_REGISTRATION` | `true`  | Allows new users to sign up               |
| `MAINTENANCE_MODE`    | `false` | Blocks all write operations (reads still work) |

### Frontend (`web/.env.local`)

| Variable                   | Default | Description               |
|----------------------------|---------|---------------------------|
| `VITE_ENABLE_PRIVACY_PAGE` | `true`  | Show /privacy route        |
| `VITE_ENABLE_TERMS_PAGE`   | `true`  | Show /terms route          |
| `VITE_ENABLE_SUPPORT_PAGE` | `false` | Show /support donation page |

## Authentication

Only **Magic Link** is implemented. Providers are structured for easy extension:

```
api/src/auth/
├── types.ts                   # MagicLinkProvider, OAuthProvider, PasswordProvider interfaces
└── providers/
    ├── magic-link/index.ts    # ✅ Implemented
    ├── google/index.ts        # 📝 Stub — implement OAuthProvider
    ├── github/index.ts        # 📝 Stub — implement OAuthProvider
    └── password/index.ts      # 📝 Stub — implement PasswordProvider
```

To add a new provider:
1. Implement the interface in `api/src/auth/types.ts`
2. Wire it into `AuthService.ts`
3. Add the corresponding route in `api/src/routes/auth.ts`

## Database

Two engines supported, toggled via `DATABASE_PROVIDER`:

| Value      | When to use                      | Config needed       |
|------------|----------------------------------|---------------------|
| `sqlite`   | Development, single-server deploy | `DATABASE_PATH`     |
| `postgres` | Production, multi-instance deploy | `DATABASE_URL`      |

Migrations run automatically at startup. Add new migrations to `api/src/db/migrations/` and register them in `api/src/db/migrator.ts`.

## Deployment

### Railway (API) + Cloudflare Pages (Web)

See [`docs/getting-started.md`](docs/getting-started.md) for step-by-step instructions.

**Railway:**
- Uses `Dockerfile.api`
- Health check: `GET /api/health`
- Set all env vars from `.env.prod.example` in the Railway dashboard

**Cloudflare Pages:**
- Build command: `npm run build --workspace=web`
- Output directory: `web/dist`
- Set `API_URL` to your Railway service URL
- The `functions/api/[[path]].js` Worker proxies `/api/*` to the backend

### Docker (self-hosted)

```bash
cp .env.prod.example .env.prod
# Edit .env.prod with real values
docker compose --env-file .env.prod up -d --build
```

## Customising the Starter

To create a new project from this starter:

1. Clone the repository
2. Update `app.name` in `web/src/i18n/en.ts` and `pt-BR.ts`
3. Update branding: `web/index.html`, `web/public/site.webmanifest`, `web/public/og-image.svg`, `web/public/favicon.svg`
4. Update domains in `web/public/robots.txt`, `web/public/sitemap.xml`, and `web/index.html`
5. Update email defaults in `api/src/services/emailTranslations.ts` (`APP_NAME`)
6. Add your domain routes to `api/src/index.ts` and `web/src/App.tsx`
7. Add your features under `web/src/pages/` and `api/src/routes/`

## Environment Variables

See `api/.env.example` and `web/.env.example` for the full list with descriptions.  
See `.env.prod.example` for the production template (Docker).

## Adding i18n Languages

1. Create `web/src/i18n/fr.ts` (copy `en.ts` structure, translate values)
2. Register it in `web/src/i18n/index.ts`
3. Add `{ code: 'fr', label: 'Français', short: 'FR' }` to `LanguageSwitcher.tsx`
4. Add email translations to `api/src/services/emailTranslations.ts`

## Adding a Theme

Add a `[data-theme="your-theme"]` block to `web/src/index.css` overriding the same CSS variables as the dark theme block.
