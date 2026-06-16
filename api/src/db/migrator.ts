import { Migrator } from 'kysely/migration'
import type { Migration, MigrationProvider } from 'kysely/migration'
import { kysely } from './index.js'
import * as initialSchema from './migrations/0001_initial_schema.js'

// Migrations are listed explicitly so imports work in both dev (tsx) and production (compiled JS).
// Add new migration files here in chronological order.
const migrations: Record<string, Migration> = {
  '0001_initial_schema': initialSchema,
}

const provider: MigrationProvider = {
  getMigrations: async () => migrations,
}

export const migrator = new Migrator({ db: kysely, provider })
