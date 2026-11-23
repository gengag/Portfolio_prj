import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizAnswerSubmission {
  questionId: Types.ObjectId;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  examId?: Types.ObjectId;
  subjectId?: Types.ObjectId;
  quizType: 'practice' | 'mock' | 'weak_topic' | 'diagnostic';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  answers: IQuizAnswerSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    quizType: {
      type: String,
      enum: ['practice', 'mock', 'weak_topic', 'diagnostic'],
      default: 'practice'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed'
    },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        selectedOptionId: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        timeSpentSeconds: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

QuizAttemptSchema.index({ userId: 1, createdAt: -1 });

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

