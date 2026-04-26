export enum ImageVariant {
  Original = 'original',
  Thumb = 'thumb',
  Preview = 'preview',
}

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export const VARIANTS = {
  [ImageVariant.Thumb]: { width: 128, height: 128, quality: 70 },
  [ImageVariant.Preview]: { width: 512, height: 512, quality: 80 },
};
