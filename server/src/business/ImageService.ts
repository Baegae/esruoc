import {getUnsignedUrl, uploadFileToStorage} from '@database/Firebase';
import ImageOutput from '@shared/response/ImageOutput';
import crypto from 'crypto';
import request from 'request';
import fs from 'fs';

export class ImageService {
  async uploadImage(image: any): Promise<ImageOutput> {
    const randomKey = crypto.randomBytes(16).toString('hex');
    await uploadFileToStorage('image', randomKey, image);
    const imageUrl = await getUnsignedUrl(`image/${randomKey}`);

    return {
      success: 1,
      file: {
        url: imageUrl,
        name: randomKey
      }
    };
  }

  async fetchUrl(url: string): Promise<ImageOutput> {
    const randomKey = crypto.randomBytes(16).toString('hex');
    const fileName = await this.downloadImage(url, randomKey);
    await uploadFileToStorage('image', randomKey, fs.readFileSync(fileName));
    const imageUrl = await getUnsignedUrl(`image/${randomKey}`);

    return {
      success: 0,
      file: {
        url: imageUrl,
        name: fileName
      }
    };
  }

  async downloadImage(url: string, filename: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      request.head(url, function (err, res, body) {
        request(url).pipe(fs.createWriteStream(filename).on('error', reject))
          .on('close', () => {
            resolve(filename);
          });
      });
    });
  }
}
