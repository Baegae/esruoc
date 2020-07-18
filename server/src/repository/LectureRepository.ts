import LectureSchema from '@database/schema/LectureSchema';
import Lecture from '@shared/entity/Lecture';
import * as mongoose from 'mongoose';

class LectureRepository {
  private lectureSchema = mongoose.model<Lecture & mongoose.Document>('Lecture', LectureSchema);

  async saveLecture(lecture: Lecture) {
    return this.lectureSchema.create(lecture);
  }
}

export default LectureRepository;
