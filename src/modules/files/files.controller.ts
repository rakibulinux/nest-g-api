import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { SkipAuth } from '@modules/auth/skip-auth.guard';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @SkipAuth()
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() body: { categoryId: string },
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ) {
    return this.filesService.uploadFile(file, body);
  }

  @SkipAuth()
  @Post('uploads')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filename: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Body() body: { productId: string },
    @UploadedFiles()
    files: Array<Express.Multer.File | Express.MulterS3.File>,
  ) {
    return this.filesService.uploadFiles(files, body);
  }

  @SkipAuth()
  @Get(':path')
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }
  @SkipAuth()
  @Get(':id')
  getImages(@Param('id') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @SkipAuth()
  @Get(':id')
  getAllImages(@Param('id') id: string) {
    return this.filesService.getAllImages(id);
  }
}
