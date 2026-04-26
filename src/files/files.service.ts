import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMAGE_EXTENSIONS, ImageVariant } from './files.constants';
import { fileExists, findOriginal, generateVariants } from './files.helpers';

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

    if (IMAGE_EXTENSIONS.includes(file.originalname)) {
      await generateVariants(file.buffer, dir);
    }

    return fileId;
  }

  async getFile(fileId: string): Promise<{ stream: fs.FileHandle; filePath: string }> {
    const dir = path.join(this.storagePath, fileId);

    const filePath = await findOriginal(dir);
    if (!filePath) {
      throw new NotFoundException('File not found');
    }

    return {
      stream: await fs.open(filePath, 'r'),
      filePath,
    };
  }

  async getImage(fileId: string, variant: ImageVariant): Promise<{ stream: fs.FileHandle; filePath: string }> {
    const dir = path.join(this.storagePath, fileId);

    if (variant !== ImageVariant.Original) {
      const variantPath = path.join(dir, `${variant}.webp`);
      if (await fileExists(variantPath)) {
        return {
          stream: await fs.open(variantPath, 'r'),
          filePath: variantPath,
        };
      }
    }

    const filePath = await findOriginal(dir);
    if (!filePath) {
      throw new NotFoundException('Image not found');
    }

    return {
      stream: await fs.open(filePath, 'r'),
      filePath,
    };
  }

  async delete(fileId: string): Promise<void> {
    const dir = path.join(this.storagePath, fileId);
    if (!(await fileExists(dir))) {
      throw new NotFoundException('File not found');
    }
    await fs.rm(dir, { recursive: true });
  }
}
