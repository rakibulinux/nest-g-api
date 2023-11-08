import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma'; // Import your Prisma service
import { Prisma, Forgot } from '@prisma/client'; // Import the generated Prisma Client types

@Injectable()
export class ForgotService {
  constructor(private prisma: PrismaService) {}

  async findOne(options: Prisma.ForgotFindFirstArgs): Promise<Forgot | null> {
    return this.prisma.forgot.findFirst({
      where: options.where,
    });
  }

  async findMany(options: Prisma.ForgotFindManyArgs): Promise<Forgot[]> {
    return this.prisma.forgot.findMany({
      where: options.where,
    });
  }

  async create(data: Prisma.ForgotCreateInput): Promise<Forgot> {
    return this.prisma.forgot.create({
      data,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.forgot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
