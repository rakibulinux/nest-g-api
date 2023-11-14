import { PrismaService } from '@providers/prisma';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatorTypes } from 'index';
import { paginator } from 'src/nodeteam';
import { UserProfile } from './user.interface';
import { MailService } from '@modules/mail/mail.service';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ForgotService } from '@modules/forgot/forgot.service';
// import { hash } from 'bcrypt';
import bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  private readonly paginate: PaginatorTypes.PaginateFunction;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private forgotService: ForgotService,
  ) {
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

  async findById(id: string): Promise<User> {
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
    const hashCode = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    const email = data.email;
    const atIndex = email.indexOf('@'); // Find the position of the '@' symbol
    const username = email.slice(0, atIndex); // Extract the username
    // Create a Prisma transaction
    const result = await this.prisma.$transaction(async (transaction) => {
      // Create a User and associate it with the Profile
      const hashPassword = await bcrypt.hash(data.password, 12);
      const user = await transaction.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashPassword,
          role: data.role,
          hash: hashCode,
        },
      });
      // Create a Profile
      await transaction.profile.create({
        data: {
          username: username,
          userId: user.id,
        },
      });
      await this.mailService.userSignUp({
        to: data.email,
        data: {
          hash: hashCode,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
    return result;
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        hash,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hash: null,
        isEmailVerified: true,
      },
    });
  }
  //forgot
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.forgotService.create({
      hash,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }

  //Reset
  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne({
      where: {
        hash,
      },
    });
    console.log(forgot);
    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.findUnique({
      where: {
        id: forgot.userId,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
      },
    });

    await this.prisma.tokenWhiteList.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await this.forgotService.softDelete(forgot.id);
  }
  /**
   * @desc Update a new user
   * @param data Prisma.UserUpdateInput
   * @returns Promise<User>
   */
  async updateProfile(
    data: Partial<UserProfile>,
    tokenUser: User,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: tokenUser.id,
      },
      include: {
        profile: true,
      },
    });
    const profile = await this.prisma.profile.findFirst({
      where: {
        userId: user.profile.userId,
      },
    });
    // Create a Prisma transaction
    const result = await this.prisma.$transaction(async (transaction) => {
      // Create a User and associate it with the Profile
      const user = await transaction.user.update({
        where: {
          id: tokenUser.id,
        },
        data: {
          name: data.name,
        },
      });
      // Create a Profile
      await transaction.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          username: data.username,
          address: data.address,
          bio: data.bio,
          phoneNo: data.phoneNo,
          profileImg: data.profileImg,
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
