import 'dotenv/config'
import './env.js' // validate env vars before anything else
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'

import { kysely } from './db/index.js'
import { migrator } from './db/migrator.js'
import { userRepository } from './repositories/UserRepository.js'
import authPlugin from './plugins/auth.js'
import maintenancePlugin from './plugins/maintenance.js'
import authRoutes from './routes/auth.js'
import meRoutes from './routes/me.js'
import { ServiceError } from './services/errors.js'

// Application version (read once at startup)
let appVersion = 'unknown'
try {
  const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../package.json')
  appVersion = (JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version?: string }).version ?? 'unknown'
} catch {
  // non-fatal: version stays 'unknown'
}

const startedAt = Date.now()

// Run pending migrations before accepting any traffic
const { error: migrationError, results: migrationResults } = await migrator.migrateToLatest()
for (const result of migrationResults ?? []) {
  if (result.status === 'Success') {
    console.log(`Migration "${result.migrationName}" applied`)
  } else if (result.status === 'Error') {
    console.error(`Migration "${result.migrationName}" failed`)
  }
}
if (migrationError) {
  console.error('Database migration failed:', migrationError)
  process.exit(1)
}

const app = Fastify({ logger: { level: process.env.NODE_ENV === 'production' ? 'warn' : 'info' } })

// Clean up expired DB rows on startup
const now = new Date().toISOString()
const [expiredSessions, expiredTokens] = await Promise.all([
  userRepository.deleteExpiredSessions(now),
  userRepository.deleteExpiredMagicTokens(now),
])
if (expiredSessions > 0 || expiredTokens > 0) {
  app.log.info(
    { expiredSessions, expiredTokens },
    'Startup cleanup: removed expired sessions and tokens',
  )
}

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ServiceError) {
    const body: Record<string, unknown> = { error: error.code }
    if (error.message) body.message = error.message
    return reply.status(error.status).send(body)
  }
  app.log.error({ err: error, requestId: request.id }, 'Unhandled error')
  return reply.status(500).send({ error: 'INTERNAL_ERROR' })
})

await app.register(fastifyHelmet, { contentSecurityPolicy: false })
await app.register(fastifyRateLimit, { global: false })
await app.register(fastifyCors, {
  origin: process.env.WEB_URL ?? 'http://localhost:5173',
  credentials: true,
})
await app.register(fastifyCookie)
await app.register(authPlugin)
await app.register(maintenancePlugin)

await app.register(authRoutes, { prefix: '/api/auth' })
await app.register(meRoutes, { prefix: '/api/me' })

// Add your domain routes here:
// await app.register(myFeatureRoutes, { prefix: '/api/my-feature' })

app.get('/api/health', async (_request, reply) => {
  let dbOk = false
  try {
    await kysely.selectFrom('users').select('id').limit(1).executeTakeFirst()
    dbOk = true
  } catch {
    // db unreachable — dbOk stays false
  }
  return reply.status(dbOk ? 200 : 503).send({
    ok: dbOk,
    version: appVersion,
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    database: process.env.DATABASE_PROVIDER ?? 'sqlite',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  })
})

const port = Number(process.env.PORT ?? 3001)
await app.listen({ port, host: '0.0.0.0' })
app.log.info(`API listening on http://localhost:${port}`)
