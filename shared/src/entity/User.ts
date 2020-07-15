import InProgressLecture from './InProgressLecture';

interface User {
    // 이름
    name: string;
    // 이메일
    email: string;
    // 구글 액세스 토큰
    googleAccessToken: string;
    // 선생님 여부 (true : 선생님 / false : 학생)
    isTeacher: boolean;
    // 수강 중인 강의 목록 (학생인 경우)
    inProgressCourses: [InProgressLecture];
    // 만든 강의 아이디 (선생님일 경우)
    uploadedCourses: [string];
    // 가입 시각
    createdAt: Date;
}

export default User;
