import { User, UserRole } from '@prisma/client';

export default class UserEntity implements User {
  readonly id!: string;

  readonly email!: string;

  readonly name!: string | null;

  readonly password!: string | null;

  readonly role!: UserRole;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;

  readonly isVerified!: boolean;
}
