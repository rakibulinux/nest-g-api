import { Module } from '@nestjs/common';
import appConfig from '@config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import swaggerConfig from '@config/swagger.config';
import HealthModule from '@modules/health/health.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import {
  loggingMiddleware,
  createUserMiddleware,
  PrismaService,
} from '@providers/prisma';
import { AuthModule } from '@modules/auth/auth.module';
import jwtConfig from '@config/jwt.config';
import { CaslModule } from '@modules/casl';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@modules/auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';
import { TokenService } from '@modules/auth/token.service';
import { TokenRepository } from '@modules/auth/token.repository';
import { UserRole } from '@prisma/client';
import mailConfig from '@config/mail.config';
import fileConfig from '@config/file.config';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { AllConfigType } from '@config/config.type';
import path from 'path';
import { ForgotModule } from '@modules/forgot/forgot.module';
import { FilesModule } from '@modules/files/files.module';
import { MailModule } from '@modules/mail/mail.module';
import { MailerModule } from '@modules/mailer/mailer.module';
import { OrderModule } from '@modules/order/order.module';
import { ProductModule } from '@modules/product/product.module';
import { CategoryModule } from '@modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        swaggerConfig,
        jwtConfig,
        mailConfig,
        fileConfig,
        s3Config,
        sqsConfig,
      ],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(), createUserMiddleware()],
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join('src/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
    CaslModule.forRoot<UserRole>({
      // Role to grant full access, optional
      superuserRole: UserRole.admin,
    }),
    HealthModule,
    UserModule,
    AuthModule,
    ForgotModule,
    FilesModule,
    MailModule,
    MailerModule,
    OrderModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [
    TokenService,
    JwtService,
    TokenRepository,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
