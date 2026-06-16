import type { User } from '../db/index.js'
import { userRepository } from '../repositories/UserRepository.js'
import { ServiceError } from './errors.js'

class UserService {
  async getMe(userId: string | null): Promise<User> {
    if (!userId) throw new ServiceError(401, 'UNAUTHORIZED', 'Authentication required')
    const user = await userRepository.findById(userId)
    if (!user) throw new ServiceError(401, 'UNAUTHORIZED', 'Authentication required')
    return user
  }

  async update(userId: string | null, fields: { name?: string; language?: string }): Promise<User> {
    if (!userId) throw new ServiceError(401, 'UNAUTHORIZED', 'Authentication required')
    return userRepository.update(userId, fields)
  }

  async deleteAccount(userId: string | null): Promise<void> {
    if (!userId) throw new ServiceError(401, 'UNAUTHORIZED', 'Authentication required')
    await userRepository.deleteUser(userId)
  }
}

export const userService = new UserService()
