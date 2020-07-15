export default interface Lesson {
    // 차시 이름
    name: string
    // 차시 시간 (밀리초)
    duration: number
    // 타임라인 (프론트가 넘겨준거 그대로)
    timeline: string
    // 강의 에셋
    asset: LessonAsset
}

export interface LessonAsset {
    // 수업자료 URL
    materialsUrl: string
    // 차시 영상 URL
    videoUrl: string
}
