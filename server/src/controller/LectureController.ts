import {BodyParam, JsonController, Post, UploadedFile} from 'routing-controllers';
import LectureService from '@business/LectureService';
import CreateLectureResponse from '@shared/response/CreateLectureResponse';

@JsonController('/lecture')
export class LectureController {
    lectureService = new LectureService();

    /**
     * @swagger
     * tags:
     *   name: Lecture
     *   description: 강의 객체
     * definitions:
     *   Lecture:
     *     type: object
     *     properties:
     *       id:
     *         type: string
     *         description: 강의 ID
     *       title:
     *         type: string
     *         description: 강의 제목
     *       description:
     *         type: string
     *         description: 강의 설명
     *       mainImageUrl:
     *         type: string
     *         description: 강의 이미지 다운로드 URL
     */

    /**
     * @swagger
     * /lecture:
     *   post:
     *     summary: 강의 생성
     *     consumes:
     *       - application/form-data
     *     parameters:
     *      - in: formData
     *        name: title
     *        type: string
     *        description: 강의 제목
     *      - in: formData
     *        name: description
     *        type: string
     *        description: 강의 설명
     *      - in: formData
     *        name: mainImage
     *        type: binary
     *        description: 메인 이미지 파일
     *
     *     tags: [Lecture]
     *     responses:
     *       200:
     *         description: 생성된 강의 정보
     *         schema:
     *           type: object
     *           $ref: '#/definitions/Lecture'
     */
    @Post('')
    async createLecture(@BodyParam('title') title: string,
                  @BodyParam('description') description: string,
                  @UploadedFile('lectureMainImage') lectureMainImage?: any): Promise<CreateLectureResponse> {
      return await this.lectureService.createLecture(lectureMainImage, {
        title: title, description: description
      });
    }
}
