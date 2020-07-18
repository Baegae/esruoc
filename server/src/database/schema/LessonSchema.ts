import * as mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  content: {type: String, required: true},
  duration: {type: Number},
  uploadedAt: {type: Date, required: true}
});

export default LessonSchema;
