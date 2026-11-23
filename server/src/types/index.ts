export type UserRole = 'student' | 'admin';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuizType = 'practice' | 'weak_topic' | 'mistakes' | 'mock' | 'ai_recommended';
export type QuestionStatus = 'pending' | 'approved' | 'rejected';
export type TutorMode =
  | 'explain_concept'
  | 'give_example'
  | 'practice_question'
  | 'explain_mistake'
  | 'summarize_topic'
  | 'give_tips'
  | 'ask_anything';

export interface IQuestionOption {
  id: string; // e.g., "A", "B", "C", "D"
  text: string;
}

export interface IGeneratedQuestion {
  questionText: string;
  options: IQuestionOption[];
  correctOptionId: string;
  explanation: string;
  concept: string;
  difficulty: QuestionDifficulty;
  tags: string[];
}

export interface IAIExplanation {
  understanding: string;
  keyInformation: string;
  stepByStepSolution: string[];
  correctAnswerReasoning: string;
  userMistakeReasoning: string;
  keyTakeaway: string;
}

export interface IStudyPlanDay {
  dayNumber: number;
  subjectName: string;
  topicName: string;
  activity: string;
  durationMinutes: number;
  difficulty: QuestionDifficulty;
  goal: string;
  isCompleted?: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
