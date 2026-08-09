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

export const KB = 1024;
export const MB = 1024 * KB;

export const MAX_FILE_SIZE = 25 * MB;

export const DOCUMENT_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.odt',
  '.ods',
  '.odp',
  '.rtf',
];

export const ARCHIVE_EXTENSIONS = ['.zip', '.rar', '.7z', '.tar', '.gz'];

export const AUDIO_EXTENSIONS = ['.mp3', '.ogg', '.wav', '.m4a', '.flac'];

export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];

export const TEXT_EXTENSIONS = ['.txt', '.csv', '.json', '.md', '.log', '.yml'];

export const ALLOWED_EXTENSIONS = [
  ...IMAGE_EXTENSIONS,
  ...DOCUMENT_EXTENSIONS,
  ...ARCHIVE_EXTENSIONS,
  ...AUDIO_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
  ...TEXT_EXTENSIONS,
];
