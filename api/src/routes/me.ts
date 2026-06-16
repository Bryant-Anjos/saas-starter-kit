import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { userService } from '../services/UserService.js'

export const updateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  language: z.enum(['en', 'pt-BR']).optional(),
})

export default async function meRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return reply.send(await userService.getMe(request.user?.id ?? null))
  })

  fastify.patch('/', async (request, reply) => {
    const parsed = updateSchema.safeParse(request.body)
    if (!parsed.success)
      return reply.status(400).send({ error: 'VALIDATION_ERROR', issues: parsed.error.issues })
    return reply.send(await userService.update(request.user?.id ?? null, parsed.data))
  })

  fastify.delete('/', async (request, reply) => {
    await userService.deleteAccount(request.user?.id ?? null)
    reply.clearCookie('session', { path: '/' })
    return reply.status(204).send()
  })
}
