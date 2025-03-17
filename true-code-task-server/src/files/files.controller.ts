import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileSchema } from './files.shemas';

@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  private validateFile(file: Express.Multer.File) {
    const validationResult = FileSchema.safeParse({
      mimetype: file.mimetype,
      size: file.size,
    });

    if (!validationResult.success) {
      throw new BadRequestException({
        message: 'Некорректный файл',
        errors: validationResult.error.format(),
      });
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    this.validateFile(file);
    const fileId = await this.filesService.saveFile(file);

    return { fileId };
  }

  @Get(':fileId')
  async file(@Param('fileId') fileId: string): Promise<StreamableFile> {
    const fileInfo = await this.filesService.getFile(fileId);
    if (!fileInfo) {
      throw new NotFoundException('Файл не найден');
    }

    return new StreamableFile(fileInfo.readStream, {
      type: fileInfo.mimeType,
    });
  }
}
