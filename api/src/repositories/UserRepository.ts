import { nanoid } from 'nanoid'
import { kysely, type User } from '../db/index.js'

interface MagicLinkToken {
  id: string
  user_id: string
  expires_at: string
  used_at: string | null
}

class UserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await kysely
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return (row as User | undefined) ?? null
  }

  async findByEmail(email: string): Promise<{ id: string; language: string } | null> {
    const row = await kysely
      .selectFrom('users')
      .select(['id', 'language'])
      .where('email', '=', email)
      .executeTakeFirst()
    return row ?? null
  }

  async create(email: string, now: string): Promise<string> {
    const id = nanoid()
    await kysely.insertInto('users').values({
      id, email, name: '', language: 'en', created_at: now, updated_at: now,
    }).execute()
    return id
  }

  async update(id: string, fields: { name?: string; language?: string }): Promise<User> {
    const now = new Date().toISOString()
    const updateData: { name?: string; language?: string; updated_at: string } = { updated_at: now }
    if (fields.name !== undefined) updateData.name = fields.name
    if (fields.language !== undefined) updateData.language = fields.language
    if (fields.name !== undefined || fields.language !== undefined) {
      await kysely.updateTable('users').set(updateData).where('id', '=', id).execute()
    }
    return (await kysely.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst())! as User
  }

  // ── Sessions ─────────────────────────────────────────────────────────────

  async findBySessionToken(token: string, now: string): Promise<User | null> {
    const row = await kysely
      .selectFrom('sessions as s')
      .innerJoin('users as u', 'u.id', 's.user_id')
      .select(['u.id', 'u.email', 'u.name', 'u.language', 'u.created_at', 'u.updated_at'])
      .where('s.token', '=', token)
      .where('s.expires_at', '>', now)
      .executeTakeFirst()
    return (row as User | undefined) ?? null
  }

  async createSession(userId: string, token: string, expiresAt: string, now: string): Promise<void> {
    await kysely.insertInto('sessions').values({
      id: nanoid(), user_id: userId, token, expires_at: expiresAt, created_at: now,
    }).execute()
  }

  async deleteSession(token: string): Promise<void> {
    await kysely.deleteFrom('sessions').where('token', '=', token).execute()
  }

  // ── Magic-link tokens ─────────────────────────────────────────────────────

  async createMagicToken(userId: string, token: string, expiresAt: string, now: string): Promise<void> {
    await kysely.insertInto('magic_link_tokens').values({
      id: nanoid(), user_id: userId, token, expires_at: expiresAt, created_at: now,
    }).execute()
  }

  async findMagicToken(token: string): Promise<MagicLinkToken | null> {
    const row = await kysely
      .selectFrom('magic_link_tokens')
      .select(['id', 'user_id', 'expires_at', 'used_at'])
      .where('token', '=', token)
      .executeTakeFirst()
    return row ?? null
  }

  async markMagicTokenUsed(id: string, usedAt: string): Promise<void> {
    await kysely
      .updateTable('magic_link_tokens')
      .set({ used_at: usedAt })
      .where('id', '=', id)
      .execute()
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────

  async deleteExpiredSessions(now: string): Promise<number> {
    const result = await kysely
      .deleteFrom('sessions')
      .where('expires_at', '<', now)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteExpiredMagicTokens(now: string): Promise<number> {
    const result = await kysely
      .deleteFrom('magic_link_tokens')
      .where('expires_at', '<', now)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // ── Account deletion ──────────────────────────────────────────────────────

  async deleteUser(userId: string): Promise<void> {
    // Sessions and magic_link_tokens cascade-delete via FK constraint.
    await kysely.deleteFrom('users').where('id', '=', userId).execute()
  }
}

export const userRepository = new UserRepository()
