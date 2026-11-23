import { Schema, model, Document, Types } from 'mongoose';

export interface ISubject extends Document {
  examId: Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'BookOpen' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Subject = model<ISubject>('Subject', SubjectSchema);

