import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('email', 'text', col => col.notNull().unique())
    .addColumn('name', 'text', col => col.notNull().defaultTo(''))
    .addColumn('language', 'text', col => col.notNull().defaultTo('en'))
    .addColumn('created_at', 'text', col => col.notNull())
    .addColumn('updated_at', 'text', col => col.notNull())
    .execute()

  await db.schema
    .createTable('magic_link_tokens')
    .ifNotExists()
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('user_id', 'text', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('token', 'text', col => col.notNull().unique())
    .addColumn('expires_at', 'text', col => col.notNull())
    .addColumn('used_at', 'text')
    .addColumn('created_at', 'text', col => col.notNull())
    .execute()

  await db.schema
    .createTable('sessions')
    .ifNotExists()
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('user_id', 'text', col =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('token', 'text', col => col.notNull().unique())
    .addColumn('expires_at', 'text', col => col.notNull())
    .addColumn('created_at', 'text', col => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sessions').ifExists().execute()
  await db.schema.dropTable('magic_link_tokens').ifExists().execute()
  await db.schema.dropTable('users').ifExists().execute()
}
