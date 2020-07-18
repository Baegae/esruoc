import LectureSchema from '@database/schema/LectureSchema';
import Lecture from '@shared/entity/Lecture';
import * as mongoose from 'mongoose';

type LectureDocument = Lecture & mongoose.Document;

class LectureRepository {
  private lectureSchema = mongoose.model<LectureDocument>('Lecture', LectureSchema);

  async saveLecture(lecture: Lecture): Promise<LectureDocument> {
    return await this.lectureSchema.create(lecture);
  }
}

export default LectureRepository;
