import UserOutput from './UserOutput';

interface LectureOutput {
  id: string,
  title: string,
  description: string,
  isDraft: boolean,
  isComplete: boolean,
  mainImageUrl?: string,
  uploadedAt: Date,
  lessonCount: number,
  isTaking: boolean,
  uploader: UserOutput
}

export default LectureOutput;
