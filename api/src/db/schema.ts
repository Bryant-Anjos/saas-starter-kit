// Kysely table definitions — one interface per table, matching the schema exactly.
// Column types use the JS representation (string for TEXT, number for INTEGER, null for nullable).

export interface UsersTable {
  id: string
  email: string
  name: string
  language: string
  created_at: string
  updated_at: string
}

export interface MagicLinkTokensTable {
  id: string
  user_id: string
  token: string
  expires_at: string
  used_at: string | null
  created_at: string
}

export interface SessionsTable {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}

export interface DB {
  users: UsersTable
  magic_link_tokens: MagicLinkTokensTable
  sessions: SessionsTable
}
