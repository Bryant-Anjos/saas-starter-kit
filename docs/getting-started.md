# Getting Started

Step-by-step guide to get from clone to production.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API

```bash
cp api/.env.example api/.env
```

The defaults work out of the box:

- **Database**: SQLite at `api/data/db.sqlite` (created automatically)
- **Email**: dev mode — magic links are printed to the console, no SMTP needed
- **Auth**: enabled, registration open

### 3. Start the dev server

```bash
npm run dev
```

- API: `http://localhost:3001`
- Web: `http://localhost:5173`

Open `http://localhost:5173`, enter your email, and copy the magic link from the API console.

### 4. (Optional) PostgreSQL + MailHog

For a more production-like local setup:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Then update `api/.env`:

```
DATABASE_PROVIDER=postgres
DATABASE_URL=postgres://starter_app:starter_app@localhost:5432/starter_app
SMTP_HOST=localhost
SMTP_PORT=1025
```

MailHog captures emails at `http://localhost:8025`.

---

## Deploying to Railway + Cloudflare Pages

### Prerequisites

- [Railway account](https://railway.app)
- [Cloudflare account](https://cloudflare.com)
- A custom domain (optional but recommended)
- [Resend account](https://resend.com) for email (free tier works)

---

### Step 1 — Create a Railway project

1. Go to [railway.app](https://railway.app) and create a new project
2. Add a **PostgreSQL** plugin to the project
3. Copy the connection string from the plugin's Variables tab

### Step 2 — Deploy the API to Railway

1. In your Railway project, add a new service → **Deploy from GitHub repo**
2. Select your repository
3. Railway will detect `railway.json` and use `Dockerfile.api`
4. Set the following environment variables in the Railway service:

```
NODE_ENV=production
DATABASE_PROVIDER=postgres
DATABASE_URL=<paste from PostgreSQL plugin>
WEB_URL=https://your-app.example.com
EMAIL_FROM=noreply@your-app.example.com
EMAIL_HTTP_URL=https://api.resend.com/emails
EMAIL_HTTP_KEY=re_xxxx
ENABLE_AUTH=true
ENABLE_REGISTRATION=true
MAINTENANCE_MODE=false
```

5. Deploy. The health check at `/api/health` must return 200 for Railway to consider it healthy.
6. Note the Railway service URL (e.g. `https://your-api.up.railway.app`)

### Step 3 — Deploy the web to Cloudflare Pages

1. Go to Cloudflare Pages → **Create a project** → **Connect to Git**
2. Select your repository
3. Set the build configuration:
   - **Build command**: `npm run build --workspace=web`
   - **Build output directory**: `web/dist`
4. Add environment variables:

```
VITE_PUBLIC_URL=https://your-app.example.com
VITE_ENABLE_PRIVACY_PAGE=true
VITE_ENABLE_TERMS_PAGE=true
VITE_ENABLE_SUPPORT_PAGE=false
API_URL=https://your-api.up.railway.app
```

5. Deploy. The Cloudflare Pages Function at `functions/api/[[path]].js` proxies `/api/*` to Railway.

### Step 4 — Configure your domain

Point your domain's DNS to Cloudflare Pages:
- Add the domain in **Cloudflare Pages → Custom Domains**
- Update `WEB_URL` in Railway to match your custom domain
- Update `VITE_PUBLIC_URL` in Cloudflare Pages to match

---

## Running Migrations

Migrations run automatically on API startup. To run them manually:

```bash
npm run migrate --workspace=api
```

---

## Docker (Self-Hosted)

```bash
cp .env.prod.example .env.prod
# Edit .env.prod with real values

docker compose --env-file .env.prod up -d --build
```

The `docker-compose.yml` starts:
- PostgreSQL on the internal network
- API (Fastify) — runs migrations on startup
- Web (React + nginx) — serves the SPA and proxies `/api/*` to the API

For HTTPS, put a reverse proxy (Caddy, Traefik, or external nginx) in front of the web container on port 443.

---

## Email Setup

Three modes, evaluated in order:

| Mode        | Config                          | When to use                            |
|-------------|----------------------------------|----------------------------------------|
| HTTP (Resend) | `EMAIL_HTTP_URL` + `EMAIL_HTTP_KEY` | Railway and other platforms with blocked SMTP |
| SMTP        | `SMTP_HOST` + credentials         | VPS or platforms allowing SMTP ports   |
| Dev console | Neither set                       | Local development only                 |

To use Resend:
1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create an API key
4. Set `EMAIL_HTTP_URL=https://api.resend.com/emails` and `EMAIL_HTTP_KEY=re_xxxx`

---

## Updating Branding

Before shipping, update these files:

| File | What to change |
|------|----------------|
| `web/src/i18n/en.ts` | `app.name`, legal page text, footer copyright |
| `web/src/i18n/pt-BR.ts` | Same in Portuguese |
| `web/index.html` | Title, meta description, OG tags, canonical URL, structured data |
| `web/public/site.webmanifest` | App name, description, categories |
| `web/public/favicon.svg` | Your logo/icon |
| `web/public/og-image.svg` | Social sharing image |
| `web/public/robots.txt` | Domain in Sitemap URL |
| `web/public/sitemap.xml` | All URLs |
| `api/src/services/emailTranslations.ts` | `APP_NAME` or set via env var |
| `docker-compose.yml` | PostgreSQL DB/user names |
| `.env.prod.example` | DB names, domain placeholder |
