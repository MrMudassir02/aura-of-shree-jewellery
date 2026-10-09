import { userRepository } from "@/server/repositories/UserRepository";

export class UserUseCases {
  async getUserById(id: string) {
    return userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return userRepository.findByEmailWithPassword(email);
  }

  async createUser(
    data: Parameters<typeof userRepository.create>[0]
  ) {
    return userRepository.create(data);
  }

  async updateUser(
    id: string,
    data: Parameters<typeof userRepository.updateById>[1]
  ) {
    return userRepository.updateById(id, data);
  }

  async markEmailVerified(id: string) {
    return userRepository.markEmailVerified(id);
  }
}

export const userUseCases = new UserUseCases();
