import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
// Import your Prisma service
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const pathToProperty = validationArguments.constraints[1];
    // Use Prisma to query the database
    const entity = await this.prisma[repository].findUnique({
      where: {
        [pathToProperty ? pathToProperty : validationArguments.property]:
          pathToProperty ? value?.[pathToProperty] : value,
      },
    });

    return Boolean(entity);
  }
}
