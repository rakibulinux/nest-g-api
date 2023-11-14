import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';
import { Order } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private stripe: Stripe,
  ) {
    this.stripe = new Stripe(process.env.API_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  create(createOrderDto: Order) {
    console.log('createOrderDto', createOrderDto);
    return this.prisma.order.createMany({
      data: createOrderDto,
    });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  async update(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    if (order) {
      const orderPriceAsNumber = order.price.toNumber();
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: orderPriceAsNumber * 100,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });
      console.log(paymentIntent);
      await this.prisma.order.update({
        where: {
          id,
        },
        data: { intent_id: paymentIntent.id, paymentStatus: true },
      });
      return { clientSecret: paymentIntent.client_secret };
    }
  }
  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
