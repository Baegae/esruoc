import * as mongoose from 'mongoose';

const LectureSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  uploaderId: {type: String, required: true},
});

export default LectureSchema;
