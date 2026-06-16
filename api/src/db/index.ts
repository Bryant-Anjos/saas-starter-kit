import BetterSqlite3 from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import { Kysely, SqliteDialect, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { DB } from './schema.js'

type Provider = 'sqlite' | 'postgres'

function createKysely(): Kysely<DB> {
  const provider = (process.env.DATABASE_PROVIDER ?? 'sqlite') as Provider

  if (provider === 'postgres') {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required when DATABASE_PROVIDER=postgres')
    }
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
    return new Kysely<DB>({ dialect: new PostgresDialect({ pool }) })
  }

  if (provider !== 'sqlite') {
    throw new Error(`Unknown DATABASE_PROVIDER "${provider}". Accepted values: sqlite, postgres`)
  }

  const dbPath = process.env.DATABASE_PATH ?? './data/db.sqlite'
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const sqlite = new BetterSqlite3(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  return new Kysely<DB>({ dialect: new SqliteDialect({ database: sqlite }) })
}

export const kysely = createKysely()

// ── Domain types ──────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  language: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}
