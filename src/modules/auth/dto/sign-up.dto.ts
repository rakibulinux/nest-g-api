import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly name!: string;
  @ApiProperty({ type: String, default: 'customer' })
  @IsString()
  readonly role?: UserRole;
  @ApiProperty({ type: String })
  @IsString()
  @Length(6, 20)
  @Matches(/[\d\W]/, {
    message:
      'password must contain at least one digit and/or special character',
  })
  @Matches(/[a-zA-Z]/, { message: 'password must contain at least one letter' })
  @Matches(/^\S+$/, { message: 'password must not contain spaces' })
  readonly password!: string;
}
