import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class MediaService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadMedia(file: Express.Multer.File) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'volt-shop' }, (error, result) => {
          if (error) return reject(error);

          if (!result) {
            return reject(new Error('Cloudinary upload failed: no result'));
          }

          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
