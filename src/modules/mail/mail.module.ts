import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '@modules/mailer/mailer.module';
import { PrismaModule, PrismaService } from '@providers/prisma';
import { UserService } from '@modules/user/user.service';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthService } from '@modules/auth/auth.service';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { EmailService } from '@modules/email';
import { ForgotService } from '@modules/forgot/forgot.service';
import { TokenRepository } from '@modules/auth/token.repository';

@Module({
  imports: [ConfigModule, MailerModule, PrismaModule, AuthModule],
  providers: [
    MailService,
    PrismaService,
    UserService,
    AuthService,
    UserRepository,
    TokenService,
    EmailService,
    ForgotService,
    TokenRepository,
  ],
  exports: [MailService],
})
export class MailModule {}
