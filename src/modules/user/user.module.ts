import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from '@modules/user/user.repository';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/user/user.permissions';
import { PrismaModule, PrismaService } from '@providers/prisma';
import { ForgotService } from '@modules/forgot/forgot.service';
import { MailService } from '@modules/mail/mail.service';
import { MailerService } from '@modules/mailer/mailer.service';

@Module({
  imports: [CaslModule.forFeature({ permissions }), PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    MailService,
    MailerService,
    UserRepository,
    PrismaService,
    ForgotService,
  ],
  exports: [UserService],
})
export class UserModule {}
