import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
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
import { AuthViews } from './auth.constants';
import { AuthAction, AuthEmailTemplates } from './auth.enum';
import { ActionName } from '@decorators/action-name.decorator';
import { BasicAuthId, CallbackUrlHeader } from './dto/reset-password.dto';
import { UserService } from '@modules/user/user.service';
import { CurrentHost } from '@decorators/current-host.decorator';
import { CallbackUrl } from '@decorators/callback-url.decorator';

@ApiTags('Auth')
@ApiBaseResponses()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiBody({ type: SignUpDto })
  @Serialize(UserBaseEntity)
  @SkipAuth()
  @Post('sign-up')
  create(@Body() signUpDto: SignUpDto): Promise<Partial<User>> {
    console.log(signUpDto);
    return this.authService.singUp(signUpDto);
  }

  @ApiBody({ type: SignInDto })
  @SkipAuth()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<Auth.AccessRefreshTokens> {
    return this.authService.signIn(signInDto);
  }

  @ApiBody({ type: RefreshTokenDto })
  @SkipAuth()
  @Post('token/refresh')
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

  @Post(AuthViews.resetPassword)
  @ActionName('User request for password update')
  @ApiHeader({ name: 'x-callback-url' })
  async resetPassword(
    @Body() { email }: BasicAuthId,
    @CurrentHost() host: string,
    @CallbackUrl() { callbackUrl }: CallbackUrlHeader,
  ) {
    console.log(email);
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new NotFoundException('Unable to reset password, user not found');

    return this.authService.generateAndSendUrl({
      host,
      user,
      action: AuthAction.RESET_PASSWORD,
      template: AuthEmailTemplates.RESET_YOUR_PASSWORD,
      callbackUrl,
    });
  }
}
