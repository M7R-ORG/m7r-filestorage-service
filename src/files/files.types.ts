import * as fs from 'fs/promises';

export interface OpenedFile {
  stream: fs.FileHandle;
  filePath: string;
}
