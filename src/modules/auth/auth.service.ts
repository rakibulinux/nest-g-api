import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserRepository } from '@modules/user/user.repository';
import {
  INVALID_CREDENTIALS,
  NOT_FOUND,
  USER_CONFLICT,
} from '@constants/errors.constants';
import { User } from '@prisma/client';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import { TokenService } from '@modules/auth/token.service';
import { AuthMessages, AuthViews } from './auth.constants';
import { GenerateAndSendUrlArgs } from './auth.typings';
import { EmailService } from 'src/email';
import { joinToUrl } from '@helpers/url';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly email: EmailService,
  ) {}

  /**
   * @desc Create a new user
   * @param signUpDto
   * @returns Promise<User> - Created user
   * @throws ConflictException - User with this email or phone already exists
   */
  async singUp(signUpDto: SignUpDto): Promise<Partial<User>> {
    const testUser: User = await this.userRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (testUser) {
      // 409001: User with this email or phone already exists
      throw new ConflictException(USER_CONFLICT);
    }

    return this.userRepository.create(signUpDto);
  }

  /**
   * @desc Sign in a user
   * @returns Auth.AccessRefreshTokens - Access and refresh tokens
   * @throws NotFoundException - User not found
   * @throws UnauthorizedException - Invalid credentials
   * @param signInDto - User credentials
   */
  async signIn(signInDto: SignInDto): Promise<Auth.AccessRefreshTokens> {
    const testUser: User = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isEmailVerified: true,
        profile: true,
      },
    });

    if (!testUser) {
      // 404001: User not found
      throw new NotFoundException(NOT_FOUND);
    }

    if (
      !(await this.tokenService.isPasswordCorrect(
        signInDto.password,
        testUser.password,
      ))
    ) {
      // 401001: Invalid credentials
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return this.tokenService.sign({
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      isEmailVerified: testUser.isEmailVerified,
    });
  }

  // Refresh Token
  refreshToken(refreshToken: string): Promise<Auth.AccessRefreshTokens | void> {
    return this.tokenService.refreshToken(refreshToken);
  }

  logout(userId: string, accessToken: string): Promise<void> {
    return this.tokenService.logout(userId, accessToken);
  }

  async generateAndSendUrl({
    host,
    user,
    action,
    template,
    callbackUrl,
  }: GenerateAndSendUrlArgs) {
    const url = callbackUrl
      ? `${joinToUrl(callbackUrl, user.id)}`
      : `${host}/auth/${AuthViews.resetPassword}/${user.id}`;
    console.log(host, user, action, template, callbackUrl);
    await this.email.sendEmail({
      subject: AuthMessages[action],
      to: user.email,
      template,
      data: {
        username: user.email.split('@')[0],
        url,
      },
    });

    return { credentials: { ...user, password: undefined }, url };
  }
}
