import * as mongoose from 'mongoose';
import LessonSchema from '@database/schema/LessonSchema';

const LectureSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  uploaderId: {type: String, required: true},
  lessons: {type: [LessonSchema]},
  isDraft: {type: Boolean, required: true},
  isComplete: {type: Boolean, required: true},
  mainImageUrl: {type: String},
  uploadedAt: {type: Date, required: true}
});

export default LectureSchema;
