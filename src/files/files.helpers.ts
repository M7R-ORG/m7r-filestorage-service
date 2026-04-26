import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ImageVariant, VARIANTS } from './files.constants';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function generateVariants(buffer: Buffer, dir: string): Promise<void> {
  const tasks = Object.entries(VARIANTS).map(async ([name, opts]) => {
    await sharp(buffer, { animated: true })
      .resize(opts.width, opts.height, { fit: 'cover' })
      .webp({ quality: opts.quality })
      .toFile(path.join(dir, `${name}.webp`));
  });

  await Promise.all(tasks);
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

export async function resolveImagePath(dir: string, variant: ImageVariant): Promise<string | null> {
  if (variant === ImageVariant.Original) {
    return findOriginal(dir);
  }

  const variantPath = path.join(dir, `${variant}.webp`);
  const hasFile = await fileExists(variantPath)
  
  return hasFile ? variantPath : null;
}
