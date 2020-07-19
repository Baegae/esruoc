import Lesson from './Lesson';

interface Lecture {
    _id?: string;
    // 강의 제목
    title: string;
    // 강의 설명
    description: string;
    // 강의자
    uploaderId: string;
    // 차시 목록
    lessons?: Lesson[];
    // 임시 저장 상태
    isDraft: boolean;
    // 완료 여부
    isComplete: boolean;
    // 대표 이미지 URL
    mainImageUrl?: string;
    // 업로드 시각
    uploadedAt: Date;
}

export default Lecture;
