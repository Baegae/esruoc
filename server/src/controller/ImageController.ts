import {JsonController, Param, Post, QueryParam, UploadedFile} from 'routing-controllers';
import {ImageService} from '@business/ImageService';
import ImageOutput from '@shared/response/ImageOutput';

@JsonController()
export class ImageController {
  private imageService = new ImageService();

  @Post('/uploadFile')
  uploadFile(
    @UploadedFile('image', {required: true}) image: any
  ): Promise<ImageOutput> {
    return this.imageService.uploadImage(image);
  }

  @Post('/fetchUrl')
  fetchUrl(@QueryParam('url') url: string): Promise<ImageOutput> {
    return this.imageService.fetchUrl(url);
  }
}
