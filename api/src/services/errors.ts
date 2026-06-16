export class ServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message?: string,
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}

export function assertAuthenticated(
  userId: string | null | undefined,
): asserts userId is string {
  if (!userId) throw new ServiceError(401, 'UNAUTHORIZED', 'Authentication required')
}
