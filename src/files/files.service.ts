import {
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMAGE_EXTENSIONS, ImageVariant } from './files.constants';
import {
  fileExists,
  findOriginal,
  renderVariants,
  resolveFileDir,
  resolveImagePath,
} from './files.helpers';
import { RenderedVariant } from './files.types';

@Injectable()
export class FilesService {
  private readonly storagePath: string;

  constructor(private readonly configService: ConfigService) {
    this.storagePath = this.configService.get<string>('storage.path');
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();

    const variants: RenderedVariant[] = IMAGE_EXTENSIONS.includes(ext)
      ? await renderVariants(file.buffer).catch(() => {
          throw new UnsupportedMediaTypeException();
        })
      : [];

    const fileId = uuidv4();
    const dir = resolveFileDir(this.storagePath, fileId);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `original${ext}`), file.buffer);
    await Promise.all(
      variants.map((variant) =>
        fs.writeFile(path.join(dir, `${variant.name}.webp`), variant.data),
      ),
    );

    return fileId;
  }

  async getFile(fileId: string): Promise<string> {
    const dir = resolveFileDir(this.storagePath, fileId);
    const filePath = await findOriginal(dir);

    if (!filePath) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  async getImage(fileId: string, variant: ImageVariant): Promise<string> {
    const dir = resolveFileDir(this.storagePath, fileId);
    const filePath = await resolveImagePath(dir, variant);

    if (!filePath) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  async delete(fileId: string): Promise<void> {
    const dir = resolveFileDir(this.storagePath, fileId);
    const exists = await fileExists(dir);

    if (!exists) {
      throw new NotFoundException('File not found');
    }

    await fs.rm(dir, { recursive: true });
  }
}
