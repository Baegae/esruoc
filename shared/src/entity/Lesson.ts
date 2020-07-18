interface Lesson {
    // 차시 이름
    name: string;
    // 차시 시간 (밀리초)
    duration: number;
    // 프론트가 준 콘텐츠 JSON 스트링화
    content: string;
    // 차시 영상 URL
    videoUrl: string;
}

export default Lesson;
