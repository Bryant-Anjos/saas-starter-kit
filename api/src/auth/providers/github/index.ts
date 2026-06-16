// ── GitHub OAuth provider (extension point) ───────────────────────────────────
//
// To implement: use GitHub's OAuth 2.0 flow.
// Wire up routes: GET /api/auth/github, GET /api/auth/github/callback
//
// import type { OAuthProvider, AuthResult } from '../../types.js'
//
// class GitHubProvider implements OAuthProvider {
//   readonly name = 'github'
//
//   getAuthorizationUrl(state: string): string {
//     // Return GitHub OAuth authorization URL
//     throw new Error('Not implemented')
//   }
//
//   async handleCallback(code: string, _state: string): Promise<AuthResult> {
//     // Exchange code for access token, fetch user profile, upsert user
//     throw new Error('Not implemented')
//   }
// }
//
// export const gitHubProvider = new GitHubProvider()
