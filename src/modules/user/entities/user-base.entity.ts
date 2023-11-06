import { Exclude, Expose } from 'class-transformer';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import UserEntity from '@modules/user/entities/user.entity';
import { Profile, UserRole } from '@prisma/client';

@Exclude()
export default class UserBaseEntity extends PartialType(UserEntity) {
  @ApiProperty({ type: String })
  @Expose()
  declare readonly id: string;

  @ApiProperty({ type: String, maxLength: 18, nullable: true })
  @Expose()
  declare readonly name: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  declare readonly email: string | null;

  @ApiProperty({ type: String, default: 'customer' })
  @Expose()
  declare readonly role: UserRole;

  @ApiProperty({ type: String })
  @Expose()
  declare readonly profile: Profile;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  declare readonly profileImg: string | null;

  @ApiProperty({ type: Boolean, default: false })
  @Expose()
  declare readonly isEmailVerified: boolean;
}
