import Lesson from "./Lesson";

export interface Lecture {
    // 강의 제목
    title: string
    // 강의 설명
    description: string
    // 강의자
    uploadedBy: string
    // 차시 목록
    lessons: [Lesson]
    // 대표 이미지 URL
    mainImageUrl: string
}
