import { Schema, model, Document, Types } from 'mongoose';

export interface ITopic extends Document {
  subjectId: Types.ObjectId;
  name: string;
  code: string;
  subtopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    subtopics: [{ type: String, trim: true }],
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Topic = model<ITopic>('Topic', TopicSchema);

