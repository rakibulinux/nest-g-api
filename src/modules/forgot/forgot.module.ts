import { Module } from '@nestjs/common';
import { ForgotService } from './forgot.service';
import { PrismaModule, PrismaService } from '@providers/prisma';

@Module({
  imports: [PrismaModule],
  providers: [ForgotService, PrismaService],
  exports: [ForgotService],
})
export class ForgotModule {}
