import CreateLectureRequest from '@shared/request/CreateLectureRequest';
import LectureRepository from '@repository/LectureRepository';

class CreateLectureService {
  lectureRepository = new LectureRepository();

  async createLecture(lectureMainImage: any, payload: CreateLectureRequest) {
    await this.lectureRepository.saveLecture({
      title: payload.title,
      description: payload.description,
      uploaderId: 'dsa28s'
    });
  }
}

export default CreateLectureService;
