import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';
import { ImageVariant } from './files.constants';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<UploadResponseDto> {
    const fileId = await this.filesService.upload(file);
    return { fileId };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const result = await this.filesService.getFile(id);
    this.streamFile(res, result);
  }

  @Get('img/:id')
  async getImage(
    @Param('id') id: string,
    @Query('variant') variant: ImageVariant,
    @Res() res: Response,
  ) {
    const result = await this.filesService.getImage(id, variant || ImageVariant.Original);
    this.streamFile(res, result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResponseDto> {
    await this.filesService.delete(id);
    return { success: true };
  }

  private streamFile(res: Response, result: { stream: any; filePath: string }) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(result.filePath);
    result.stream.close();
  }
}
