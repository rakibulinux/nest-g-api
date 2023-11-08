import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import HealthController from '@modules/health/health.controller';
import { EmailService } from '@modules/email';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [EmailService],
})
export default class HealthModule {}
