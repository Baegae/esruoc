interface InProgressLecture {
    // 강의 ID
    lectureId: string;
    // 수강 완료한 차시 ID
    completeLessonIds: string[];
}

export default InProgressLecture;
