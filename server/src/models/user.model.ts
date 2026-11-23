import { Schema, model, Document } from 'mongoose';

export interface IUserSelectedExam {
  id: string;
  name: string;
  code: string;
}

export interface IUserSelectedSubject {
  id: string;
  name: string;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role: 'user' | 'admin';
  isOnboarded: boolean;
  selectedExam?: IUserSelectedExam;
  selectedSubjects?: IUserSelectedSubject[];
  preparationGoal?: string;
  targetDate?: string;
  dailyStudyHours?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  streak?: {
    current: number;
    longest: number;
    lastActiveDate?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isOnboarded: { type: Boolean, default: false },
    selectedExam: {
      id: { type: String },
      name: { type: String },
      code: { type: String }
    },
    selectedSubjects: [
      {
        id: { type: String },
        name: { type: String }
      }
    ],
    preparationGoal: { type: String, default: '' },
    targetDate: { type: String, default: '' },
    dailyStudyHours: { type: Number, default: 2 },
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
