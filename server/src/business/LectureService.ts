import CreateLectureRequest from '@shared/request/CreateLectureRequest';
import LectureRepository from '@repository/LectureRepository';
import {getSignedUrl, getPublicUrl, uploadFileToStorage} from '@database/Firebase';
import CreateLectureResponse from '@shared/response/CreateLectureResponse';
import Lesson from '@shared/entity/Lesson';
import CreateLessonResponse from '@shared/response/CreateLessonResponse';
import {Types} from 'mongoose';
import {NotFoundError} from 'routing-controllers';
import User from '@shared/entity/User';

class CreateLectureService {
    lectureRepository = new LectureRepository();

    async createLecture(user: User, lectureMainImage: any, payload: CreateLectureRequest): Promise<CreateLectureResponse> {
      const savedLecture = await this.lectureRepository.saveLecture({
        title: payload.title,
        description: payload.description,
        uploaderId: user.uid,
        lessons: [],
        isDraft: false,
        isComplete: false,
        mainImageUrl: '',
        uploadedAt: new Date()
      });

      await uploadFileToStorage(`lecture/${savedLecture._id}`, 'MainImage', lectureMainImage);
      const mainImageUrl = await getPublicUrl(`lecture/${savedLecture._id}/MainImage`);

      await this.lectureRepository.updateMainImageUrl(savedLecture.id, mainImageUrl);

      return {
        id: savedLecture.id.toString(),
        title: savedLecture.title,
        description: savedLecture.description,
        mainImageUrl
      };
    }

    async createLesson(lectureId: string, videoFile: any, lesson: Lesson): Promise<CreateLessonResponse> {
      let lecture;
      let savedLesson;

      try {
        lecture = await this.lectureRepository.getLecture({'_id': new Types.ObjectId(lectureId)});
        savedLesson = await this.lectureRepository.saveLesson(lecture, lesson);
      } catch (e) {
        throw new NotFoundError(e);
      }

      const savePath = `lecture/${lecture.id}/lessons/${savedLesson._id.toString()}`;
      await uploadFileToStorage(savePath, 'LessonVideo', videoFile);
      const lessonVideoUrl = await getSignedUrl(`${savePath}/LessonVideo`);

      const result = {
        lectureId: lecture.id,
        lessonId: savedLesson._id.toString(),
        title: savedLesson.title,
        description: savedLesson.description,
        videoUrl: lessonVideoUrl,
      };

      return result;
    }
}

export default CreateLectureService;
