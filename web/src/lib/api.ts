export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
  if (res.status === 204) return undefined as T
  const data = await res.json()
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'UNKNOWN', data.message ?? res.statusText)
  return data as T
}

const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined })
const patch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' })

export interface User {
  id: string
  email: string
  name: string
  language: string
}

export const api = {
  auth: {
    sendMagicLink: (email: string, language?: string, redirect?: string) =>
      post('/api/auth/magic-link', { email, language, redirect }),
    verify: (token: string) => post('/api/auth/verify', { token }),
    signOut: () => del('/api/auth/session'),
  },
  me: {
    get: () => get<User>('/api/me'),
    update: (data: Partial<Pick<User, 'name' | 'language'>>) => patch<User>('/api/me', data),
    delete: () => del('/api/me'),
  },
}
