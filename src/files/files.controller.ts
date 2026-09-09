import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountGuard } from '../common/guards/account.guard';
import { RequiredFilePipe, UuidV4Pipe } from '../common/common.pipes';
import { FilesService } from './files.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';
import { ImageVariant } from './files.constants';
import { UploadFileInterceptor } from './files.interceptors';
import { sendFileResponse } from './files.response';

@Controller()
@UseGuards(AccountGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(UploadFileInterceptor)
  async upload(
    @UploadedFile(RequiredFilePipe) file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    const fileId = await this.filesService.upload(file);
    return { fileId };
  }

  @Get(':id')
  async getFile(@Param('id', UuidV4Pipe) id: string, @Res() res: Response) {
    const filePath = await this.filesService.getFile(id);
    sendFileResponse(res, filePath, { inline: false });
  }

  @Get('img/:id')
  async getImage(
    @Param('id', UuidV4Pipe) id: string,
    @Query('variant') variant: ImageVariant,
    @Res() res: Response,
  ) {
    const filePath = await this.filesService.getImage(id, variant);
    sendFileResponse(res, filePath, { inline: true });
  }

  @Delete(':id')
  async delete(
    @Param('id', UuidV4Pipe) id: string,
  ): Promise<DeleteResponseDto> {
    await this.filesService.delete(id);
    return { success: true };
  }
}
