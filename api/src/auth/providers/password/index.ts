// ── Password provider (extension point) ───────────────────────────────────────
//
// To implement: install `bcrypt` or `argon2` for password hashing.
// Wire up routes: POST /api/auth/register, POST /api/auth/login
// Add `password_hash` column to the users table via a new migration.
//
// import type { PasswordProvider, AuthResult } from '../../types.js'
//
// class PasswordAuth implements PasswordProvider {
//   readonly name = 'password'
//
//   async hashPassword(password: string): Promise<string> {
//     // Return bcrypt/argon2 hash
//     throw new Error('Not implemented')
//   }
//
//   async verifyCredentials(email: string, password: string): Promise<AuthResult> {
//     // Fetch user, verify password hash, return userId
//     throw new Error('Not implemented')
//   }
// }
//
// export const passwordProvider = new PasswordAuth()
