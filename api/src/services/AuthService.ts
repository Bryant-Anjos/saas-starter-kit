import { nanoid } from 'nanoid'
import { magicLinkProvider } from '../auth/providers/magic-link/index.js'
import { userRepository } from '../repositories/UserRepository.js'
import { assertAuthenticated } from './errors.js'

const SESSION_DAYS = 30

class AuthService {
  async sendMagicLink(email: string, clientLanguage?: string, redirect?: string): Promise<void> {
    await magicLinkProvider.sendLink(email, { language: clientLanguage, redirect })
  }

  async verifyMagicLink(token: string): Promise<{ sessionToken: string; expiresAt: string }> {
    const { userId } = await magicLinkProvider.verifyToken(token)

    const now = new Date()
    const sessionToken = nanoid(48)
    const expiresAt = new Date(now.getTime() + SESSION_DAYS * 86_400_000).toISOString()
    await userRepository.createSession(userId, sessionToken, expiresAt, now.toISOString())

    return { sessionToken, expiresAt }
  }

  async logout(userId: string | null, sessionToken: string | undefined): Promise<void> {
    assertAuthenticated(userId)
    if (sessionToken) await userRepository.deleteSession(sessionToken)
  }
}

export const authService = new AuthService()
