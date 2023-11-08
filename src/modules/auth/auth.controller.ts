import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import {
  ApiBearerAuth,
  ApiBody,
  //  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import { User } from '@prisma/client';
import Serialize from '@decorators/serialize.decorator';
import UserBaseEntity from '@modules/user/entities/user-base.entity';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import { SkipAuth } from '@modules/auth/skip-auth.guard';
import RefreshTokenDto from '@modules/auth/dto/refresh-token.dto';
import {
  AccessGuard,
  Actions,
  CaslUser,
  UseAbility,
  UserProxy,
} from '@modules/casl';
import { TokensEntity } from '@modules/auth/entities/tokens.entity';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { UserRepository } from '@modules/user/user.repository';

@ApiTags('Auth')
@ApiBaseResponses()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  @ApiBody({ type: SignUpDto })
  @Serialize(UserBaseEntity)
  @SkipAuth()
  @Post('sign-up')
  async create(@Body() signUpDto: SignUpDto): Promise<Partial<User>> {
    return this.authService.singUp(signUpDto);
  }

  @ApiBody({ type: SignInDto })
  @SkipAuth()
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<Auth.AccessRefreshTokens> {
    return this.authService.signIn(signInDto);
  }

  @ApiBody({ type: RefreshTokenDto })
  @SkipAuth()
  @Post('refresh-token')
  async refreshToken(@Request() req): Promise<Auth.AccessRefreshTokens | void> {
    return this.authService.refreshToken(req.headers.authorization);
  }
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @HttpCode(204)
  @UseAbility(Actions.delete, TokensEntity)
  async logout(@CaslUser() userProxy?: UserProxy<User>) {
    const { accessToken } = await userProxy.getMeta();
    const { id: userId } = await userProxy.get();

    return this.authService.logout(userId, accessToken);
  }

  @SkipAuth()
  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.userRepository.confirmEmail(confirmEmailDto.hash);
  }

  @SkipAuth()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.userRepository.forgotPassword(forgotPasswordDto.email);
  }

  @SkipAuth()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.userRepository.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }
}
