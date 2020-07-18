import * as mongoose from 'mongoose';
import User from '@shared/entity/User';
import UserSchema from '@database/schema/UserSchema';

type UserDocument = User & mongoose.Document;

class UserRepository {
  private userSchema = mongoose.model<User & mongoose.Document>('User', UserSchema);

  async saveUser(user: User): Promise<User> {
    return this.userSchema.create(user);
  }

  async findUserByUid(uid: string): Promise<UserDocument | null> {
    return this.userSchema.findOne({ uid : uid }).exec();
  }
}

export default UserRepository;
