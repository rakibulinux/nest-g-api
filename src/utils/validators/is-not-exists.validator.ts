import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const currentValue = validationArguments.object as ValidationEntity;

    // Use Prisma to query the database
    const entity = await this.prisma[repository].findUnique({
      where: {
        [validationArguments.property]: value,
      },
    });

    if (entity?.id === currentValue?.id) {
      return true;
    }

    return !entity;
  }
}
