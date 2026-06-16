import type { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import type { User } from '../db/index.js'
import { userRepository } from '../repositories/UserRepository.js'

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('user', null)

  fastify.addHook('preHandler', async (request: FastifyRequest) => {
    const token = request.cookies?.session
    if (!token) return
    const user = await userRepository.findBySessionToken(token, new Date().toISOString())
    if (user) request.user = user
  })
}

export default fp(authPlugin)
