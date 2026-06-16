// ── Google OAuth provider (extension point) ───────────────────────────────────
//
// To implement: install `googleapis` or use the raw OAuth 2.0 flow.
// Wire up routes: GET /api/auth/google, GET /api/auth/google/callback
//
// import type { OAuthProvider, AuthResult } from '../../types.js'
//
// class GoogleProvider implements OAuthProvider {
//   readonly name = 'google'
//
//   getAuthorizationUrl(state: string): string {
//     // Return Google OAuth authorization URL
//     throw new Error('Not implemented')
//   }
//
//   async handleCallback(code: string, _state: string): Promise<AuthResult> {
//     // Exchange code for tokens, fetch user profile, upsert user
//     throw new Error('Not implemented')
//   }
// }
//
// export const googleProvider = new GoogleProvider()
