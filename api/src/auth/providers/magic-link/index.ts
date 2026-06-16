import { nanoid } from 'nanoid'
import type { MagicLinkProvider, AuthResult } from '../../types.js'
import { userRepository } from '../../../repositories/UserRepository.js'
import { sendMagicLink } from '../../../services/email.js'
import { ServiceError } from '../../../services/errors.js'

const EXPIRY_MINUTES = Number(process.env.MAGIC_LINK_EXPIRY_MINUTES ?? 15)

class MagicLink implements MagicLinkProvider {
  readonly name = 'magic-link'

  async sendLink(
    email: string,
    options: { language?: string; redirect?: string } = {},
  ): Promise<void> {
    const now = new Date()
    const nowIso = now.toISOString()

    const existing = await userRepository.findByEmail(email)
    const language = existing ? existing.language : options.language

    const shouldRegister = !existing
    if (shouldRegister && process.env.ENABLE_REGISTRATION === 'false') {
      throw new ServiceError(403, 'REGISTRATION_DISABLED', 'New account registration is disabled')
    }

    const userId = existing ? existing.id : await userRepository.create(email, nowIso)

    const token = nanoid(32)
    const expiresAt = new Date(now.getTime() + EXPIRY_MINUTES * 60_000).toISOString()
    await userRepository.createMagicToken(userId, token, expiresAt, nowIso)

    await sendMagicLink(email, token, options.redirect, language)
  }

  async verifyToken(token: string): Promise<AuthResult> {
    const row = await userRepository.findMagicToken(token)
    if (!row) throw new ServiceError(404, 'NOT_FOUND', 'Invalid token')
    if (row.used_at) throw new ServiceError(410, 'ALREADY_USED', 'Token already used')
    if (new Date(row.expires_at) < new Date()) throw new ServiceError(410, 'EXPIRED', 'Token expired')

    await userRepository.markMagicTokenUsed(row.id, new Date().toISOString())

    return { userId: row.user_id }
  }
}

export const magicLinkProvider = new MagicLink()
