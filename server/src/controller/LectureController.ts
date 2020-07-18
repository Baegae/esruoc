import {BodyParam, JsonController, Post, UploadedFile} from 'routing-controllers';
import LectureService from '@business/LectureService';
import SuccessResponse from '@controller/SuccessResponse';

@JsonController('/lecture')
export class LectureController {
    lectureService = new LectureService();

    @Post('')
    async createLecture(@BodyParam('title') title: string,
                  @BodyParam('description') description: string,
                  @UploadedFile('lectureMainImage') lectureMainImage?: any) {
      await this.lectureService.createLecture(lectureMainImage, {
        title: title, description: description
      });

      return SuccessResponse;
    }
}
