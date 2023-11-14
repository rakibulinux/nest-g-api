import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '@providers/prisma';
import Stripe from 'stripe';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, Stripe],
})
export class OrderModule {}
