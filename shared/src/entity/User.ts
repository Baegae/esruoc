import InProgressLecture from './InProgressLecture';

interface User {
    // ID
    uid: string;
    // 이름
    name: string;
    // 이메일
    email: string;
    // 프로필 이미지 url
    profileImageUrl: string;
    // 수강 중인 강의 목록 (학생인 경우)
    inProgressCourses?: [InProgressLecture];
    // 만든 강의 아이디 (선생님일 경우)
    uploadedCourses?: [string];
    // 가입 시각
    createdAt: Date;
}

export default User;
