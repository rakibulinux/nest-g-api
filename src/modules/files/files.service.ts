import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from '@prisma/client';
import { PrismaService } from '@providers/prisma';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService, // Inject your Prisma service
  ) {}

  async getAllImages(id: string) {
    return this.prisma.file.findMany({
      where: {
        productId: id,
      },
    });
  }
  async uploadFile(
    file: Express.Multer.File | Express.MulterS3.File,
    body: { categoryId: string },
  ): Promise<File> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: (file as Express.MulterS3.File).location,
    };

    // Save the file using Prisma
    const savedFile = await this.prisma.file.create({
      data: {
        path: path[this.configService.get('file.driver')],
        categoryId: body.categoryId,
      },
    });

    return savedFile;
  }
  async uploadFiles(
    files: Array<Express.Multer.File | Express.MulterS3.File>,
    body: { productId: string },
  ): Promise<any> {
    if (!files) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            files: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const filePaths = files.map((file) => file.path);
    // Save the file paths to the database using Prisma
    await this.prisma.file.createMany({
      data: filePaths.map((filePath) => ({
        path: `/${filePath}`,
        productId: body.productId,
      })),
    });
    // Retrieve the details of the saved images from the database
    const imageDetails = await this.prisma.file.findMany({
      where: {
        OR: filePaths.map((image) => ({ path: `/${image}` })),
      },
    });
    return imageDetails;
  }
}
