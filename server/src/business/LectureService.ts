import CreateLectureRequest from '@shared/request/CreateLectureRequest';
import LectureRepository from '@repository/LectureRepository';
import {getSignedUrl, getPublicUrl, uploadFileToStorage} from '@database/Firebase';
import CreateLectureResponse from '@shared/response/CreateLectureResponse';
import Lesson from '@shared/entity/Lesson';
import CreateLessonResponse from '@shared/response/CreateLessonResponse';
import {Types} from 'mongoose';
import {NotFoundError} from 'routing-controllers';
import User from '@shared/entity/User';
import Lecture from '@shared/entity/Lecture';
import LectureOutput from '@shared/response/LectureOutput';
import UserRepository from '@repository/UserRepository';
import LectureListOutput from '@shared/response/LectureListOutput';
import LessonOutput from '@shared/response/LessonOutput';
import LectureDetailOutput from '@shared/response/LectureDetailOutput';

class LectureService {
    lectureRepository = new LectureRepository();
    userRepository = new UserRepository();

    async getLectures(): Promise<LectureListOutput>{
      const result: LectureOutput[] = [];
      const lectureDocuments = await this.lectureRepository.getAllLectures();
      for (const lectureDocument of lectureDocuments) {
        const lecture = lectureDocument as Lecture;
        const output = await this.mapLectureOutput(lecture);
        result.push(output);
      }
      return {lectures: result};
    }

    async getMyLectures(user: User): Promise<LectureListOutput> {
      const result: LectureOutput[] = [];

      const lectureDocuments = await this.lectureRepository.getAllLectures();
      for (const lectureDocument of lectureDocuments) {
        const lecture = lectureDocument as Lecture;
        if (lecture.uploaderId == user.uid) {const output = await this.mapLectureOutput(lecture);
          result.push(output);}
      }
      return {lectures: result};
    }

    async createLecture(user: User, lectureMainImage: any, payload: CreateLectureRequest): Promise<CreateLectureResponse> {
      const savedLecture = await this.lectureRepository.saveLecture({
        isComplete: false,
        uploadedAt: new Date(),
        title: payload.title,
        description: payload.description,
        lessons: [],
        uploaderId: user.uid,
        isDraft: false,
        mainImageUrl: '',
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

    async getLessons(lectureId: string, user: User): Promise<LectureDetailOutput> {
      const lecture = await this.lectureRepository.getLecture({'_id': new Types.ObjectId(lectureId)});
      const lessons = (lecture as Lecture).lessons;
      const result: LessonOutput[] = [];

      if (!lessons) {
        const output = await this.mapLectureOutput(lecture);
        return {
          id: output.id,
          title: output.title,
          description: output.description,
          isDraft: output.isDraft,
          isComplete: output.isComplete,
          mainImageUrl: output.mainImageUrl,
          uploadedAt: output.uploadedAt,
          lessonCount: output.lessonCount,
          isTaking: output.isTaking,
          uploader: output.uploader,
          uploadedByMe: user.uid == output.uploader.uid,
          lessons: result
        };
      }

      for (const lesson of lessons) {
        result.push({
          id: lesson.id!,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          uploadedAt: lesson.uploadedAt
        });
      }
      const output = await this.mapLectureOutput(lecture);
      return {
        id: output.id,
        title: output.title,
        description: output.description,
        isDraft: output.isDraft,
        isComplete: output.isComplete,
        mainImageUrl: output.mainImageUrl,
        uploadedAt: output.uploadedAt,
        lessonCount: output.lessonCount,
        isTaking: output.isTaking,
        uploader: output.uploader,
        uploadedByMe: user.uid == output.uploader.uid,
        lessons: result
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

    private async mapLectureOutput(lecture: Lecture): Promise<LectureOutput> {
      const user = await this.userRepository.findUserByUid(lecture.uploaderId);
      const takingLecture = user?.inProgressCourses
        ?.map(inProgressLecture => inProgressLecture.lectureId);
      const isTaking: boolean = (takingLecture == null) ? false :
        takingLecture.includes(lecture._id!.toString());
      return {
        id: lecture._id!.toString(),
        title: lecture.title,
        description: lecture.description,
        isDraft: lecture.isDraft,
        isComplete: lecture.isComplete,
        mainImageUrl: lecture.mainImageUrl,
        uploadedAt: lecture.uploadedAt,
        lessonCount: (lecture.lessons == null) ? 0 : lecture.lessons.length,
        isTaking: isTaking,
        uploader: {
          uid: user!.uid,
          name: user!.name,
          email: user!.email,
          profileImageUrl: user!.profileImageUrl
        }
      };
    }
}

export default LectureService;
