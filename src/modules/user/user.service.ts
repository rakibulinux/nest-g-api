import { Injectable } from '@nestjs/common';
import { UserRepository } from '@modules/user/user.repository';
import { Prisma, User } from '@prisma/client';
import { PaginatorTypes } from 'index';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  /**
   * @desc Find a user by id
   * @param id
   * @returns Promise<User>
   */
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  /**
   * @desc Find a user by id
   * @param id
   * @returns Promise<User>
   */
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  /**
   * @desc Find all users with pagination
   * @param where
   * @param orderBy
   */
  async findAll(
    where: Prisma.UserWhereInput,
    orderBy: Prisma.UserOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<User>> {
    return this.userRepository.findAll(where, orderBy);
  }
}
