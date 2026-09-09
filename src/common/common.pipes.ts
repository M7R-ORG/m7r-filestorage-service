import { ParseFilePipe, ParseUUIDPipe } from '@nestjs/common';

export const UuidV4Pipe = new ParseUUIDPipe({ version: '4' });
export const RequiredFilePipe = new ParseFilePipe({ fileIsRequired: true });
