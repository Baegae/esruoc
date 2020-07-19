import {Body, JsonController, Post, Res, UploadedFile} from 'routing-controllers';
import {ImageService} from '@business/ImageService';
import ImageOutput from '@shared/response/ImageOutput';
import FetchUrlInput from '@shared/request/FetchUrlInput';

@JsonController()
export class ImageController {
  private imageService = new ImageService();

  @Post('/uploadFile')
  async uploadFile(
    @UploadedFile('image', {required: true}) image: any
  ): Promise<ImageOutput> {
    console.log(image);
    return this.imageService.uploadImage(image);
  }

  @Post('/fetchUrl')
  fetchUrl(@Body() fetchUrlInput: FetchUrlInput): Promise<ImageOutput> {
    return this.imageService.fetchUrl(fetchUrlInput.url);
  }
}
