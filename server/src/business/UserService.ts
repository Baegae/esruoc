import LoginInput from '@shared/request/LoginInput';
import * as admin from 'firebase-admin';
import UserRepository from '@repository/UserRepository';
import UserRecord = admin.auth.UserRecord;
import {UnauthorizedError} from 'routing-controllers';

export class UserService {
  private userRepository = new UserRepository();

  async login(loginInput: LoginInput) {

    try {
      const decodedToken = await admin.auth().verifyIdToken(loginInput.googleAccessToken);
      const uid = decodedToken.uid;
      const userRecord = await admin.auth().getUser(uid);

      if (await this.userRepository.findUserByUid(userRecord.uid) == null) {
        this.saveUser(userRecord);
      }

      return uid;
    } catch (e) {
      throw new UnauthorizedError('인증 정보가 잘못되었습니다.');
    }
  }

  private saveUser(userRecord: UserRecord) {
    this.userRepository.saveUser({
      uid: userRecord.uid,
      name: userRecord.displayName!,
      email: userRecord.email!,
      createdAt: new Date()
    });
  }

}
