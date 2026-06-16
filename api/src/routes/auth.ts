import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authService } from '../services/AuthService.js'
import { env } from '../env.js'

const magicLinkSchema = z.object({
  email: z.string().email(),
  language: z.enum(['en', 'pt-BR']).optional(),
  redirect: z.string().optional(),
})
const verifySchema = z.object({ token: z.string().min(1) })

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/magic-link', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
        errorResponseBuilder: () => ({
          error: 'RATE_LIMITED',
          message: 'Too many requests. Please wait before requesting another sign-in link.',
        }),
      },
    },
  }, async (request, reply) => {
    if (!env.ENABLE_AUTH) {
      return reply.status(503).send({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' })
    }
    const parsed = magicLinkSchema.safeParse(request.body)
    if (!parsed.success)
      return reply.status(400).send({ error: 'VALIDATION_ERROR', issues: parsed.error.issues })
    await authService.sendMagicLink(parsed.data.email, parsed.data.language, parsed.data.redirect)
    return reply.status(200).send({ ok: true })
  })

  fastify.post('/verify', async (request, reply) => {
    if (!env.ENABLE_AUTH) {
      return reply.status(503).send({ error: 'AUTH_DISABLED', message: 'Authentication is disabled.' })
    }
    const parsed = verifySchema.safeParse(request.body)
    if (!parsed.success)
      return reply.status(400).send({ error: 'VALIDATION_ERROR', issues: parsed.error.issues })
    const { sessionToken, expiresAt } = await authService.verifyMagicLink(parsed.data.token)
    reply.setCookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresAt),
    })
    return reply.status(200).send({ ok: true })
  })

  fastify.delete('/session', async (request, reply) => {
    await authService.logout(request.user?.id ?? null, request.cookies?.session)
    reply.clearCookie('session', { path: '/' })
    return reply.status(200).send({ ok: true })
  })
}
