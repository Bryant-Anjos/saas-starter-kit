// ── Auth provider interfaces ───────────────────────────────────────────────────
//
// Each provider handles a specific authentication method.
// Only MagicLinkProvider is implemented in this starter.
// Add new providers by implementing the appropriate interface and wiring
// them into AuthService + the auth routes.

export interface AuthResult {
  userId: string
}

export interface AuthProvider {
  readonly name: string
}

// Magic-link: email → one-time token → session
export interface MagicLinkProvider extends AuthProvider {
  sendLink(email: string, options?: { language?: string; redirect?: string }): Promise<void>
  verifyToken(token: string): Promise<AuthResult>
}

// OAuth (Google, GitHub, etc.): redirect → callback → session
export interface OAuthProvider extends AuthProvider {
  getAuthorizationUrl(state: string): string
  handleCallback(code: string, state: string): Promise<AuthResult>
}

// Password: email + password → session
export interface PasswordProvider extends AuthProvider {
  verifyCredentials(email: string, password: string): Promise<AuthResult>
  hashPassword(password: string): Promise<string>
}
