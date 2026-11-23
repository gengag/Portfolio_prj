export type UserRole = 'student' | 'admin';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuizType = 'practice' | 'weak_topic' | 'mistakes' | 'mock' | 'ai_recommended';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  selectedExam?: {
    id: string;
    name: string;
    code: string;
  };
  selectedSubjects?: Array<{
    id: string;
    name: string;
  }>;
  preparationGoal?: string;
  targetDate?: string;
  dailyStudyHours?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  streak?: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  isOnboarded?: boolean;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface IExam {
  _id: string;
  name: string;
  code: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

export interface ISubject {
  _id: string;
  examId: string;
  name: string;
  code: string;
  icon?: string;
}

export interface ITopic {
  _id: string;
  subjectId: string;
  name: string;
  subtopics: string[];
}

export interface IQuestionOption {
  id: string;
  text: string;
}

export interface IQuestion {
  _id: string;
  questionText: string;
  options: IQuestionOption[];
  correctOptionId?: string;
  explanation?: string;
  concept?: string;
  difficulty: QuestionDifficulty;
  tags?: string[];
}
