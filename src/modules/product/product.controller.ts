import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import { Prisma, Product } from '@prisma/client';
import { SkipAuth } from '@modules/auth/skip-auth.guard';
import { OrderByPipe, PaginatorTypes, WherePipe } from 'src/nodeteam';

@ApiTags('Product')
@ApiBaseResponses()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Product) {
    return this.productService.create(createProductDto);
  }

  @SkipAuth()
  @ApiQuery({ name: 'where', required: false, type: 'string' })
  @ApiQuery({ name: 'orderBy', required: false, type: 'string' })
  @Get()
  async findAll(
    @Query('where', WherePipe) where?: Prisma.ProductWhereInput,
    @Query('orderBy', OrderByPipe)
    orderBy?: Prisma.ProductOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<Product>> {
    return this.productService.findAll(where, orderBy);
  }

  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
