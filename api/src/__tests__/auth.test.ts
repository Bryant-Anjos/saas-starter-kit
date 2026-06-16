import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../repositories/UserRepository.js', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
    createMagicToken: vi.fn(),
    findMagicToken: vi.fn(),
    markMagicTokenUsed: vi.fn(),
    createSession: vi.fn(),
    deleteSession: vi.fn(),
  },
}))

vi.mock('../services/email.js', () => ({
  sendMagicLink: vi.fn(),
}))

const { authService } = await import('../services/AuthService.js')
const { userRepository } = await import('../repositories/UserRepository.js')

describe('verifyMagicLink error codes', () => {
  const baseToken = {
    id: 'tok-1',
    user_id: 'user-1',
    expires_at: new Date(Date.now() + 600_000).toISOString(),
    used_at: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(userRepository.markMagicTokenUsed).mockResolvedValue(undefined)
    vi.mocked(userRepository.createSession).mockResolvedValue(undefined)
  })

  it('throws ALREADY_USED (410) when token has been used', async () => {
    vi.mocked(userRepository.findMagicToken).mockResolvedValue({
      ...baseToken,
      used_at: new Date(Date.now() - 60_000).toISOString(),
    })

    await expect(authService.verifyMagicLink('any-token')).rejects.toMatchObject({
      status: 410,
      code: 'ALREADY_USED',
    })
  })

  it('throws EXPIRED (410) when token has expired', async () => {
    vi.mocked(userRepository.findMagicToken).mockResolvedValue({
      ...baseToken,
      expires_at: new Date(Date.now() - 60_000).toISOString(),
      used_at: null,
    })

    await expect(authService.verifyMagicLink('any-token')).rejects.toMatchObject({
      status: 410,
      code: 'EXPIRED',
    })
  })

  it('throws NOT_FOUND (404) for unknown tokens', async () => {
    vi.mocked(userRepository.findMagicToken).mockResolvedValue(null)

    await expect(authService.verifyMagicLink('unknown')).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
    })
  })

  it('returns session token for valid unused non-expired token', async () => {
    vi.mocked(userRepository.findMagicToken).mockResolvedValue(baseToken)

    const result = await authService.verifyMagicLink('valid-token')
    expect(result.sessionToken).toBeTruthy()
    expect(result.expiresAt).toBeTruthy()
  })
})
