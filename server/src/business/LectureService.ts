import CreateLectureRequest from '@shared/request/CreateLectureRequest';
import LectureRepository from '@repository/LectureRepository';
import {getDownloadUrl, uploadFileToStorage} from '@database/Firebase';
import CreateLectureResponse from '@shared/response/CreateLectureResponse';

class CreateLectureService {
    lectureRepository = new LectureRepository();

    async createLecture(lectureMainImage: any, payload: CreateLectureRequest): Promise<CreateLectureResponse> {
      const savedLecture = await this.lectureRepository.saveLecture({
        title: payload.title,
        description: payload.description,
        uploaderId: 'dsa28s'
      });

      await uploadFileToStorage(`lecture/${savedLecture._id}`, 'MainImage', lectureMainImage);
      const mainImageUrl = await getDownloadUrl(`lecture/${savedLecture._id}/MainImage`);

      return {
        id: savedLecture._id.toString(),
        title: savedLecture.title,
        description: savedLecture.description,
        mainImageUrl
      };
    }
}

export default CreateLectureService;
