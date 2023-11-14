import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '@providers/prisma';
import { PaginatorTypes } from 'index';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: Product) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findAll(
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<Product>> {
    return this.prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: true,
      },
    }) as unknown as Promise<PaginatorTypes.PaginatedResult<Product>>;
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });
  }

  async update(
    id: string,
    updateProductDto: Partial<Product>,
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException(`No Product found with this ID: ${id}`);
    }
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        isFeatured: updateProductDto.isFeatured,
        availability: updateProductDto.availability,
        description: updateProductDto.description,
        slug: updateProductDto.slug,
      },
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
