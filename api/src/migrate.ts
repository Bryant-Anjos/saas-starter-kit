import 'dotenv/config'
import { migrator } from './db/migrator.js'

const { error, results } = await migrator.migrateToLatest()

for (const result of results ?? []) {
  if (result.status === 'Success') {
    console.log(`  ✓ ${result.migrationName}`)
  } else if (result.status === 'Error') {
    console.error(`  ✗ ${result.migrationName}`)
  }
}

if (error) {
  console.error('Migration failed:', error)
  process.exit(1)
}

if (!results?.length) {
  console.log('Database is already up to date.')
} else {
  console.log('Migrations complete.')
}
