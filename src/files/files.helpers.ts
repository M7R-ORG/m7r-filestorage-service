import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  ForbiddenException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { ALLOWED_EXTENSIONS, ImageVariant, VARIANTS } from './files.constants';
import { RenderedVariant } from './files.types';

export function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void {
  const ext = path.extname(file.originalname).toLowerCase();

  ALLOWED_EXTENSIONS.includes(ext)
    ? callback(null, true)
    : callback(new UnsupportedMediaTypeException('File type is not allowed'));
}

export function resolveFileDir(storagePath: string, fileId: string): string {
  const root = path.resolve(storagePath);
  const dir = path.resolve(root, fileId);

  if (!dir.startsWith(root + path.sep)) {
    throw new ForbiddenException('Invalid file identifier');
  }

  return dir;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function renderVariants(
  buffer: Buffer,
): Promise<RenderedVariant[]> {
  const tasks = Object.entries(VARIANTS).map(async ([name, opts]) => ({
    name,
    data: await sharp(buffer, { animated: true })
      .resize(opts.width, opts.height, { fit: 'cover' })
      .webp({ quality: opts.quality })
      .toBuffer(),
  }));

  return Promise.all(tasks);
}

export async function findOriginal(dir: string): Promise<string | null> {
  try {
    const files = await fs.readdir(dir);
    const original = files.find((f) => f.startsWith('original'));
    return original ? path.join(dir, original) : null;
  } catch {
    return null;
  }
}

export async function resolveImagePath(
  dir: string,
  variant: ImageVariant,
): Promise<string | null> {
  if (variant === ImageVariant.Original) {
    return findOriginal(dir);
  }

  const variantPath = path.join(dir, `${variant}.webp`);
  const hasFile = await fileExists(variantPath);

  return hasFile ? variantPath : null;
}
