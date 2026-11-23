import { Schema, model, Document } from 'mongoose';

export interface IExam extends Document {
  name: string;
  code: string;
  description: string;
  category: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    icon: { type: String, default: 'Award' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Exam = model<IExam>('Exam', ExamSchema);

