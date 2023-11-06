import { PrismaService } from '@providers/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatorTypes } from 'index';
import { paginator } from 'src/nodeteam';

@Injectable()
export class UserRepository {
  private readonly paginate: PaginatorTypes.PaginateFunction;

  constructor(private prisma: PrismaService) {
    /**
     * @desc Create a paginate function
     * @param model
     * @param options
     * @returns Promise<PaginatorTypes.PaginatedResult<T>>
     */
    this.paginate = paginator({
      page: 1,
      perPage: 10,
    });
  }

  findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  /**
   * @desc Find a user by params
   * @param params Prisma.UserFindFirstArgs
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  async findOne(params: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.prisma.user.findFirst(params);
  }

  /**
   * @desc Create a new user
   * @param data Prisma.UserCreateInput
   * @returns Promise<User>
   */
  async create(data: Prisma.UserCreateInput): Promise<Partial<User>> {
    const email = data.email;
    console.log(data);
    const atIndex = email.indexOf('@'); // Find the position of the '@' symbol
    const username = email.slice(0, atIndex); // Extract the username
    // Create a Prisma transaction
    const result = await this.prisma.$transaction(async (transaction) => {
      // Create a User and associate it with the Profile
      const user = await transaction.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          password: false,
          createdAt: true,
          updatedAt: true,
        },
      });
      // Create a Profile
      await transaction.profile.create({
        data: {
          username: username,
          userId: user.id,
        },
      });

      return user;
    });
    return result;
  }

  /**
   * @desc Find all users with pagination
   * @param where Prisma.UserWhereInput
   * @param orderBy Prisma.UserOrderByWithRelationInput
   * @returns Promise<PaginatorTypes.PaginatedResult<User>>
   */
  async findAll(
    where: Prisma.UserWhereInput,
    orderBy: Prisma.UserOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<User>> {
    return this.paginate(this.prisma.user, {
      where,
      orderBy,
      include: {
        profile: true,
      },
    });
  }
}
