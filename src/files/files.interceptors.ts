import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE } from './files.constants';
import { fileFilter } from './files.helpers';

export const UploadFileInterceptor = FileInterceptor('file', {
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
