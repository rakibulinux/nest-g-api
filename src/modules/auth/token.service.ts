import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenRepository } from '@modules/auth/token.repository';
import { TokenWhiteList } from '@prisma/client';
const EXPIRE_TIME = 1000 * 60 * 5;
interface IPayload {
  id: string;
  name: string;
  isEmailVerified: boolean;
  email: string;
  role: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async sign(payload: IPayload): Promise<Auth.AccessRefreshTokens> {
    const userId = payload.id;
    const _accessToken = this.createJwtAccessToken(payload);
    const _refreshToken = this.createJwtRefreshToken(payload);

    const _savedRefreshToken =
      await this.tokenRepository.saveRefreshTokenToWhitelist(
        userId,
        _refreshToken,
      );

    await this.tokenRepository.saveAccessTokenToWhitelist(
      userId,
      _savedRefreshToken.id,
      _accessToken,
    );

    return {
      user: payload,
      backendTokens: {
        accessToken: _accessToken,
        refreshToken: _refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async getAccessTokenFromWhitelist(
    accessToken: string,
  ): Promise<TokenWhiteList | void> {
    const token =
      await this.tokenRepository.getAccessTokenFromWhitelist(accessToken);

    if (!token) {
      // check if token is in the whitelist
      throw new UnauthorizedException();
    }
  }

  async refreshToken(
    refreshToken: any,
  ): Promise<Auth.AccessRefreshTokens | void> {
    const token =
      await this.tokenRepository.getRefreshTokenFromWhitelist(refreshToken);
    if (!token) {
      // check if token is in the whitelist
      throw new UnauthorizedException();
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshToken'),
    });
    const _payload = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      isEmailVerified: payload.isEmailVerified,
    };

    const _accessToken = this.createJwtAccessToken(_payload);
    const _refreshToken = this.createJwtRefreshToken(_payload);

    const _savedRefreshToken =
      await this.tokenRepository.saveRefreshTokenToWhitelist(
        _payload.id,
        _refreshToken,
      );

    await this.tokenRepository.saveAccessTokenToWhitelist(
      _payload.id,
      _savedRefreshToken.id,
      _accessToken,
    );

    return {
      backendTokens: {
        accessToken: _accessToken,
        refreshToken: _refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async logout(userId: string, accessToken: string): Promise<void> {
    const _accessToken =
      await this.tokenRepository.getUserAccessTokenFromWhitelist(
        userId,
        accessToken,
      );

    await Promise.all([
      this.tokenRepository.deleteAccessTokenFromWhitelist(_accessToken.id),
      this.tokenRepository.deleteRefreshTokenFromWhitelist(
        _accessToken.refreshTokenId,
      ),
    ]);

    return;
  }

  async isPasswordCorrect(
    dtoPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(dtoPassword, password);
  }

  createJwtAccessToken(payload: Buffer | object): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('jwt.jwtExpAccessToken'),
      secret: this.configService.get<string>('jwt.accessToken'),
    });
  }

  createJwtRefreshToken(payload: Buffer | object): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('jwt.jwtExpRefreshToken'),
      secret: this.configService.get<string>('jwt.refreshToken'),
    });
  }
}
