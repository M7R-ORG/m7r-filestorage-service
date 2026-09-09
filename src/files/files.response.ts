import { Response } from 'express';
import * as path from 'path';

export function sendFileResponse(
  res: Response,
  filePath: string,
  options: { inline: boolean },
): void {
  const filename = path.basename(filePath);

  res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (options.inline) {
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  } else {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }

  res.sendFile(filePath);
}
