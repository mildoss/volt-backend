import {Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {MediaService} from "./media.service";
import {AuthGuard} from "@nestjs/passport";
import {OnlyAdminGuard} from "../auth/guards/admin.guard";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @HttpCode(200)
  @Post()
  @UseGuards(AuthGuard('jwt'), OnlyAdminGuard)
  @UseInterceptors(FileInterceptor('media'))
  async uploadMediaFile(@UploadedFile() mediaFile: Express.Multer.File) {
    const result = await this.mediaService.uploadMedia(mediaFile);
    return {
      url: result.secure_url,
      name: result.original_filename
    };
  }
}