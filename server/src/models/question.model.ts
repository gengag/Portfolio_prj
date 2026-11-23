import { Schema, model, Document, Types } from 'mongoose';

export interface IQuestionOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
}

export interface IQuestion extends Document {
  examId: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId?: Types.ObjectId;
  questionText: string;
  options: IQuestionOption[];
  correctOptionId: string;
  explanation: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'Topic', index: true },
    questionText: { type: String, required: true, trim: true },
    options: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true }
      }
    ],
    correctOptionId: { type: String, required: true },
    explanation: { type: String, default: '' },
    concept: { type: String, default: '' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

QuestionSchema.index({ examId: 1, subjectId: 1, difficulty: 1 });

export const Question = model<IQuestion>('Question', QuestionSchema);

