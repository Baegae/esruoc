import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: {type: String, required: true, unique: true, index: {unique: true}},
  name: {type: String, required: true},
  email: {type: String, required: true},
  profileImageUrl: {type: String, required: true},
  createdAt: {type: Date, required: true},
});

export default UserSchema;
