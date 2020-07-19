import UserOutput from './UserOutput';
import LessonOutput from './LessonOutput';

interface LectureDetailOutput {
  id: string,
  title: string,
  description: string,
  isDraft: boolean,
  isComplete: boolean,
  mainImageUrl?: string,
  uploadedAt: Date,
  lessonCount: number,
  isTaking: boolean,
  uploader: UserOutput,
  uploadedByMe: boolean,
  lessons: LessonOutput[]
}

export default LectureDetailOutput;
