import {uploadFileToStorage} from '@database/Firebase';
import ImageOutput from '@shared/response/ImageOutput';
import crypto from 'crypto';
import request from 'request';
import fs from 'fs';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export class ImageService {
  async uploadImage(image: File): Promise<ImageOutput> {
    const randomKey = crypto.randomBytes(16).toString('hex');
    const imageUrl = await uploadFileToStorage('image', `${randomKey}`, image);

    await sleep(3000);

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
    const imageUrl = await uploadFileToStorage('image', randomKey, fs.readFileSync(fileName));

    await sleep(3000);

    return {
      success: 1,
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
