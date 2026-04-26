import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMAGE_EXTENSIONS, ImageVariant } from './files.constants';
import { fileExists, findOriginal, generateVariants, resolveImagePath } from './files.helpers';
import { OpenedFile } from './files.types';

@Injectable()
export class FilesService {
  private readonly storagePath: string;

  constructor(private readonly configService: ConfigService) {
    this.storagePath = this.configService.get<string>('storage.path');
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const fileId = uuidv4();
    const dir = path.join(this.storagePath, fileId);
    await fs.mkdir(dir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase();
    await fs.writeFile(path.join(dir, `original${ext}`), file.buffer);

    if (IMAGE_EXTENSIONS.includes(ext)) {
      await generateVariants(file.buffer, dir);
    }

    return fileId;
  }

  async getFile(fileId: string): Promise<OpenedFile> {
    const filePath = await findOriginal(this.dirOf(fileId));
    return this.openFile(filePath);
  }

  async getImage(fileId: string, variant: ImageVariant): Promise<OpenedFile> {
    const filePath = await resolveImagePath(this.dirOf(fileId), variant);
    return this.openFile(filePath);
  }

  private dirOf(fileId: string): string {
    return path.join(this.storagePath, fileId);
  }

  private async openFile(filePath: string | null): Promise<OpenedFile> {
    if (!filePath) {
      throw new NotFoundException('File not found');
    }

    return {
      stream: await fs.open(filePath, 'r'),
      filePath,
    };
  }

  async delete(fileId: string): Promise<void> {
    const dir = path.join(this.storagePath, fileId);
    const hasFile = await fileExists(dir)

    if (!hasFile) {
      throw new NotFoundException('File not found');
    }
    
    await fs.rm(dir, { recursive: true });
  }
}
