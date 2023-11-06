import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches } from 'class-validator';

export class BasicAuthId {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string;
}

export class CallbackUrlHeader {
  @IsOptional()
  @Matches(/^(http?):\/\/.*/, { message: 'callbackUrl is not a valid URL' })
  @ApiPropertyOptional()
  callbackUrl: string;
}
