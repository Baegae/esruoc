import {BodyParam, CurrentUser, Get, JsonController, Param, Post, UploadedFile} from 'routing-controllers';
import LectureService from '@business/LectureService';
import CreateLectureResponse from '@shared/response/CreateLectureResponse';
import CreateLessonResponse from '@shared/response/CreateLessonResponse';
import User from '@shared/entity/User';
import LectureListOutput from '@shared/response/LectureListOutput';

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
@JsonController('/lecture')
export class LectureController {
    lectureService = new LectureService();

    /**
   * @swagger
   * definitions:
   *   LectureListOutput:
   *     type: object
   *     properties:
   *       lectures:
   *         type: object[]
   *         $ref: '#/definitions/LectureOutput'
   *         description: 강의 정보 array
   */

    /**
   * @swagger
   * definitions:
   *   LectureOutput:
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
   *         description: 강의 세부 설명
   *       isDraft:
   *         type: boolean
   *         description: 강의 draft 여부
   *       isComplete:
   *         type: boolean
   *         description: 강의 완료 여부
   *       mainImageUrl:
   *         type: string
   *         description: 강의 메인 이미지 경로
   *       uploadedAt:
   *         type: Date
   *         description: 강의 제작 날짜
   *       uploader:
   *         type: object
   *         description: 제작한 유저 정보
   */

    /**
   * @swagger
   * /lecture:
   *   get:
   *     summary: 강의 목록 제공
   *
   *     tags: [Lecture]
   *     responses:
   *       200:
   *         description: 강의 목록 정보
   *         schema:
   *           type: object
   *           $ref: '#/definitions/LectureListOutput'
   */
    @Get('')
    async getLectures(): Promise<LectureListOutput> {
      return await this.lectureService.getLectures();
    }

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
    async createLecture(@CurrentUser() user: User,
                        @BodyParam('title', {required: true}) title: string,
                        @BodyParam('description', {required: true}) description: string,
                        @UploadedFile('lectureMainImage') lectureMainImage?: any): Promise<CreateLectureResponse> {
      return await this.lectureService.createLecture(
        user,
        lectureMainImage,
        {
          title: title, description: description
        }
      );
    }

    /**
     * @swagger
     * definitions:
     *   CreateLessonResponse:
     *     type: object
     *     properties:
     *       lectureId:
     *         type: string
     *         description: 강의 ID
     *       lessonId:
     *         type: string
     *         description: 차시 ID
     *       title:
     *         type: string
     *         description: 차시 제목
     *       description:
     *         type: string
     *         description: 차시 설명
     *       videoUrl:
     *         type: string
     *         description: 차시 영상 URL
     */

    /**
     * @swagger
     * /lecture/{lectureId}/lesson:
     *   post:
     *     summary: 차시 생성
     *     consumes:
     *       - application/form-data
     *     parameters:
     *      - in: path
     *        name: lectureId
     *        schema:
     *          type: string
     *        required: true
     *        description: 해당 차시가 연결될 강의 ID
     *      - in: formData
     *        name: title
     *        type: string
     *        description: 차시 제목
     *      - in: formData
     *        name: description
     *        type: string
     *        description: 차시 설명
     *      - in: formData
     *        name: content
     *        type: string
     *        description: 프론트에서 온 콘텐츠 객체
     *      - in: formData
     *        name: duration
     *        type: number
     *        description: 영상 길이 (밀리초)
     *      - in: formData
     *        name: lessonVideo
     *        type: binary
     *        description: 차시 영상 파일
     *
     *     tags: [Lecture]
     *     responses:
     *       200:
     *         description: 생성된 차시 정보
     *         schema:
     *           type: object
     *           $ref: '#/definitions/CreateLessonResponse'
     */
    @Post('/:lectureId/lesson')
    async createLesson(@Param('lectureId') lectureId: string,
                       @BodyParam('title', {required: true}) title: string,
                       @BodyParam('description', {required: true}) description: string,
                       @BodyParam('content', {required: true}) content: string,
                       @BodyParam('duration',{required: true}) duration: number,
                       @UploadedFile('lessonVideo', {required: true}) lessonVideo: any): Promise<CreateLessonResponse> {
      return await this.lectureService.createLesson(lectureId, lessonVideo, {
        title: title,
        description: description,
        content: content,
        videoUrl: '',
        uploadedAt: new Date(),
        duration,
      });
    }
}
