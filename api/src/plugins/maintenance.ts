import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

// HTTP methods that mutate state. GET, HEAD, OPTIONS are always read-only.
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

async function maintenancePlugin(fastify: FastifyInstance) {
  const enabled = process.env.MAINTENANCE_MODE === 'true'
  if (!enabled) return

  fastify.log.warn('Maintenance mode is enabled — write operations are blocked')

  fastify.addHook('onRequest', async (request, reply) => {
    if (!WRITE_METHODS.has(request.method)) return
    // Auth routes bypass maintenance so users can still log in and out.
    if (request.url.startsWith('/api/auth')) return

    return reply.status(503).send({
      error: 'MAINTENANCE_MODE',
      message: 'The system is currently in maintenance mode.',
    })
  })
}

export default fp(maintenancePlugin)
