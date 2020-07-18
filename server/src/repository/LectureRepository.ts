import LectureSchema from '@database/schema/LectureSchema';
import Lecture from '@shared/entity/Lecture';
import * as mongoose from 'mongoose';
import Lesson from '@shared/entity/Lesson';
import {Types} from 'mongoose';

type LectureDocument = Lecture & mongoose.Document;
type LessonDocument = Lesson & mongoose.Document;

class LectureRepository {
    private lectureSchema = mongoose.model<LectureDocument>('Lecture', LectureSchema);

    async saveLecture(lecture: Lecture): Promise<LectureDocument> {
      return await this.lectureSchema.create(lecture);
    }

    async getLecture(filter: any): Promise<LectureDocument> {
      return new Promise<LectureDocument>((resolve, reject) => {
        this.lectureSchema.findOne(filter, (err, document) => {
          if (document == null) {
            reject('No lecture match the filter.');
          } else {
            resolve(document);
          }
        });
      });
    }

    async saveLesson(lecture: LectureDocument, lesson: Lesson): Promise<LessonDocument> {
        lecture.lessons?.push(lesson);
        const savedLecture = await lecture.save();
        const savedLesson = savedLecture.lessons?.[savedLecture.lessons?.length - 1];

        return await this.getLesson(lecture.id, savedLesson!._id!);
    }

    async getLesson(lectureId: string, lessonId: string): Promise<LessonDocument> {
      return new Promise<LessonDocument>((resolve, reject) => {
        this.lectureSchema.aggregate([
          {'$unwind': '$lessons'},
          {
            '$match': {
              '_id': new Types.ObjectId(lectureId),
              'lessons._id': new Types.ObjectId(lessonId),
            },
          }
        ]).exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result.length > 0) {
              resolve(result[0].lessons);
            } else {
              reject();
            }
          }
        });
      });
    }
}

export default LectureRepository;
