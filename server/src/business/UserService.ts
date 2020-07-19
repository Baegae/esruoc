import LoginInput from '@shared/request/LoginInput';
import * as admin from 'firebase-admin';
import UserRepository from '@repository/UserRepository';
import UserRecord = admin.auth.UserRecord;
import {UnauthorizedError} from 'routing-controllers';
import {encodeJWT} from '@business/AuthService';
import User from '@shared/entity/User';

export class UserService {
  private userRepository = new UserRepository();

  async login(loginInput: LoginInput) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(loginInput.googleAccessToken);
      const uid = decodedToken.uid;
      const userRecord = await admin.auth().getUser(uid);
      console.log(userRecord);

      let user = await this.userRepository.findUserByUid(userRecord.uid) as User;
      if (user == null) {
        user = await this.saveUser(userRecord);
      }

      return encodeJWT(user);
    } catch (e) {
      throw new UnauthorizedError('Unauthorized');
    }
  }

  private async saveUser(userRecord: UserRecord): Promise<User> {
    return await this.userRepository.saveUser({
      uid: userRecord.uid,
      name: userRecord.displayName!,
      email: userRecord.email!,
      description: '',
      profileImageUrl: userRecord.photoURL!,
      createdAt: new Date()
    });
  }
}
