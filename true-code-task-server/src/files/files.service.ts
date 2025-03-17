import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { File } from './file.entity';
import { createReadStream, existsSync, ReadStream } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import * as crypto from 'crypto';

@Injectable()
export class FilesService {
  private readonly dirPath = `${process.cwd()}/upload`;

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await mkdir(this.dirPath, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при создании папки для загрузки файлов');
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileId = crypto.randomUUID();
    const filePath = `${this.dirPath}/${fileId}`;

    try {
      await writeFile(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при сохранении файла');
    }

    try {
      const fileEnt = new File();
      fileEnt.id = fileId;
      fileEnt.filename = file.originalname;
      fileEnt.mimeType = file.mimetype;
      await fileEnt.save();

      return fileId;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при сохранении информации о файле в БД');
    }
  }

  async getFile(fileId: string): Promise<{ readStream: ReadStream; name: string; mimeType: string }> {
    const filePath = `${this.dirPath}/${fileId}`;
    const fileInfo = await File.findOneBy({ id: fileId });

    if (!fileInfo || !existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    return {
      readStream: createReadStream(filePath),
      name: fileInfo.filename,
      mimeType: fileInfo.mimeType,
    };
  }
}
