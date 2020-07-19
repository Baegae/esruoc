import UserOutput from './UserOutput';

interface LectureOutput {
  id: string,
  title: string,
  description: string,
  isDraft: boolean,
  isComplete: boolean,
  mainImageUrl?: string,
  uploadedAt: Date,
  uploader: UserOutput
}

export default LectureOutput;
