import { Request, Response } from 'express';
import { Question } from '../models/question.model';
import { QuizAttempt } from '../models/quizAttempt.model';
import { Exam } from '../models/exam.model';
import { Subject } from '../models/subject.model';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/apiResponse';

const SEED_SAMPLE_QUESTIONS = [
  // Quantitative Aptitude
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_QUANT',
    questionText: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
    options: [
      { id: 'A', text: '65 seconds' },
      { id: 'B', text: '89 seconds' },
      { id: 'C', text: '100 seconds' },
      { id: 'D', text: '75 seconds' }
    ],
    correctOptionId: 'B',
    concept: 'Speed, Time and Distance',
    difficulty: 'medium',
    explanation: 'Speed of train = Distance / Time = 240 / 24 = 10 m/s. Total distance to pass platform = Length of train + Length of platform = 240 + 650 = 890 m. Time taken = 890 / 10 = 89 seconds.',
    tags: ['Trains', 'Speed & Distance', 'Arithmetic']
  },
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_QUANT',
    questionText: 'In a mixture of 60 litres, the ratio of milk and water is 2 : 1. If this ratio is to be 1 : 2, then the quantity of water to be further added is:',
    options: [
      { id: 'A', text: '20 litres' },
      { id: 'B', text: '40 litres' },
      { id: 'C', text: '60 litres' },
      { id: 'D', text: '80 litres' }
    ],
    correctOptionId: 'C',
    concept: 'Ratios and Mixtures',
    difficulty: 'easy',
    explanation: 'Quantity of milk = (2/3) * 60 = 40 litres. Quantity of water = 20 litres. Let water added be x litres. Then 40 / (20 + x) = 1 / 2 => 20 + x = 80 => x = 60 litres.',
    tags: ['Ratio', 'Mixtures']
  },
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_QUANT',
    questionText: 'What should come in place of question mark (?) in the following series? 4, 18, 48, 100, 180, ?',
    options: [
      { id: 'A', text: '280' },
      { id: 'B', text: '294' },
      { id: 'C', text: '312' },
      { id: 'D', text: '300' }
    ],
    correctOptionId: 'B',
    concept: 'Number Series Pattern Recognition',
    difficulty: 'hard',
    explanation: 'Pattern: n^3 - n^2. For n=2: 8 - 4 = 4. For n=3: 27 - 9 = 18. For n=4: 64 - 16 = 48. For n=5: 125 - 25 = 100. For n=6: 216 - 36 = 180. For n=7: 343 - 49 = 294.',
    tags: ['Number Series', 'Pattern Recognition']
  },
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_QUANT',
    questionText: 'A sum of money at compound interest amounts to thrice itself in 3 years. In how many years will it be 9 times itself at the same rate?',
    options: [
      { id: 'A', text: '6 years' },
      { id: 'B', text: '9 years' },
      { id: 'C', text: '12 years' },
      { id: 'D', text: '15 years' }
    ],
    correctOptionId: 'A',
    concept: 'Compound Interest',
    difficulty: 'medium',
    explanation: 'P becomes 3P in 3 years. At compound interest, it becomes (3)^2 = 9 times in 3 * 2 = 6 years.',
    tags: ['Compound Interest', 'Arithmetic']
  },

  // Reasoning Ability
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_REAS',
    questionText: 'Statements: Only a few books are pens. All pens are pencils. No pencil is a marker. Conclusion I: Some books are not pencils. Conclusion II: No pen is a marker.',
    options: [
      { id: 'A', text: 'Only Conclusion I follows' },
      { id: 'B', text: 'Only Conclusion II follows' },
      { id: 'C', text: 'Both Conclusion I and II follow' },
      { id: 'D', text: 'Neither follows' }
    ],
    correctOptionId: 'B',
    concept: 'Syllogisms (Only a Few)',
    difficulty: 'medium',
    explanation: 'Since All pens are pencils and No pencil is a marker, no pen can ever overlap with marker (Conclusion II is definitively true). "Only a few books are pens" does not restrict books from being pencils, so Conclusion I is not definite.',
    tags: ['Syllogism', 'Logical Reasoning']
  },
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_REAS',
    questionText: 'Pointing to a photograph, Rohit said, "She is the daughter of the only son of my grandfather." How is the girl in the photograph related to Rohit?',
    options: [
      { id: 'A', text: 'Mother' },
      { id: 'B', text: 'Sister' },
      { id: 'C', text: 'Daughter' },
      { id: 'D', text: 'Cousin' }
    ],
    correctOptionId: 'B',
    concept: 'Blood Relations',
    difficulty: 'easy',
    explanation: 'The only son of grandfather = Rohit\'s father. Daughter of Rohit\'s father = Rohit\'s sister.',
    tags: ['Blood Relations']
  },
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_REAS',
    questionText: 'In a certain code language, "SYSTEM" is written as "SYSMET" and "NEARER" is written as "AENRER". How is "FRACTION" written in that code?',
    options: [
      { id: 'A', text: 'CARFNOIT' },
      { id: 'B', text: 'NOITCARF' },
      { id: 'C', text: 'CRAFNOIT' },
      { id: 'D', text: 'CARFTION' }
    ],
    correctOptionId: 'A',
    concept: 'Coding-Decoding',
    difficulty: 'medium',
    explanation: 'The word is divided into two halves and each half is reversed. FRACTION has 8 letters: First half FRAC reversed = CARF. Second half TION reversed = NOIT. Combined = CARFNOIT.',
    tags: ['Coding-Decoding']
  },

  // English Language
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_ENG',
    questionText: 'Identify the part of the sentence containing a grammatical error: "Neither of the two candidates (A) / who appeared for the interview (B) / were selected by the panel (C) / No error (D)"',
    options: [
      { id: 'A', text: 'Neither of the two candidates' },
      { id: 'B', text: 'who appeared for the interview' },
      { id: 'C', text: 'were selected by the panel' },
      { id: 'D', text: 'No error' }
    ],
    correctOptionId: 'C',
    concept: 'Subject-Verb Agreement',
    difficulty: 'medium',
    explanation: 'Part C is incorrect. "Neither of" is followed by a plural noun but takes a singular verb. "were selected" must be corrected to "was selected".',
    tags: ['Grammar', 'Error Spotting']
  },
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_ENG',
    questionText: 'Select the most appropriate synonym for the word: EPHEMERAL',
    options: [
      { id: 'A', text: 'Eternal' },
      { id: 'B', text: 'Transient' },
      { id: 'C', text: 'Monumental' },
      { id: 'D', text: 'Resilient' }
    ],
    correctOptionId: 'B',
    concept: 'Vocabulary',
    difficulty: 'easy',
    explanation: 'Ephemeral means lasting for a very short time. Synonym: Transient, Fleeting. Antonym: Eternal, Permanent.',
    tags: ['Vocabulary', 'Synonyms']
  },

  // General & Banking Awareness
  {
    examCode: 'BANKING',
    subjectCode: 'BANK_GA',
    questionText: 'Which regulatory body controls and manages the monetary policy and inflation targeting in India?',
    options: [
      { id: 'A', text: 'Securities and Exchange Board of India (SEBI)' },
      { id: 'B', text: 'Reserve Bank of India (RBI)' },
      { id: 'C', text: 'Ministry of Finance' },
      { id: 'D', text: 'NITI Aayog' }
    ],
    correctOptionId: 'B',
    concept: 'Monetary Policy & Banking Framework',
    difficulty: 'easy',
    explanation: 'The Reserve Bank of India (RBI), under the RBI Act 1934, is the statutory authority that conducts monetary policy via the Monetary Policy Committee (MPC) with an inflation target of 4% (+/- 2%).',
    tags: ['Banking Awareness', 'RBI']
  }
];

// Helper to seed questions if database is empty
export const seedQuestionsIfNeeded = async () => {
  const count = await Question.countDocuments();
  if (count > 0) return;

  const exams = await Exam.find();
  const subjects = await Subject.find();

  const examMap = new Map(exams.map((e) => [e.code, e._id]));
  const subjectMap = new Map(subjects.map((s) => [s.code, s._id]));

  for (const q of SEED_SAMPLE_QUESTIONS) {
    const examId = examMap.get(q.examCode) || (exams[0] ? exams[0]._id : null);
    const subjectId = subjectMap.get(q.subjectCode) || (subjects[0] ? subjects[0]._id : null);

    if (examId && subjectId) {
      await Question.create({
        examId,
        subjectId,
        questionText: q.questionText,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        concept: q.concept,
        difficulty: q.difficulty as any,
        tags: q.tags
      });
    }
  }
};

// GET /api/quiz/questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    await seedQuestionsIfNeeded();

    const { examId, subjectId, difficulty, limit = '10' } = req.query;
    const query: any = {};

    if (examId) query.examId = examId;
    if (subjectId) query.subjectId = subjectId;
    if (difficulty && difficulty !== 'mixed') query.difficulty = difficulty;

    const numLimit = Math.min(parseInt(limit as string, 10) || 10, 30);

    let questions = await Question.find(query).limit(numLimit).lean();

    // If query was specific and yielded 0 questions, fallback to any available questions
    if (questions.length === 0) {
      questions = await Question.find().limit(numLimit).lean();
    }

    // Return sanitized question payload for active quiz taking
    const sanitized = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      difficulty: q.difficulty,
      concept: q.concept,
      tags: q.tags
    }));

    return sendSuccess(res, 'Questions retrieved successfully', {
      total: sanitized.length,
      questions: sanitized
    });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to retrieve questions', 500);
  }
};

// POST /api/quiz/submit
export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const requestWithUser = req as any;
    const userId = requestWithUser.user?.id || requestWithUser.user?._id;

    const {
      examId,
      subjectId,
      quizType = 'practice',
      difficulty = 'mixed',
      timeSpentSeconds = 0,
      answers = []
    } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return sendError(res, 'No answers provided for submission', 400);
    }

    // Evaluate answers
    const questionIds = answers.map((a: any) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let correctCount = 0;
    const evaluatedAnswers: any[] = [];
    const detailedReview: any[] = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId.toString());
      if (!q) continue;

      const isCorrect = ans.selectedOptionId === q.correctOptionId;
      if (isCorrect) correctCount++;

      evaluatedAnswers.push({
        questionId: q._id,
        selectedOptionId: ans.selectedOptionId,
        isCorrect,
        timeSpentSeconds: ans.timeSpentSeconds || 0
      });

      detailedReview.push({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        userSelectedOptionId: ans.selectedOptionId,
        correctOptionId: q.correctOptionId,
        isCorrect,
        explanation: q.explanation,
        concept: q.concept,
        difficulty: q.difficulty,
        tags: q.tags
      });
    }

    const totalQuestions = answers.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Save Quiz Attempt to database
    const attempt = await QuizAttempt.create({
      userId,
      examId: examId || undefined,
      subjectId: subjectId || undefined,
      quizType,
      difficulty,
      totalQuestions,
      correctAnswers: correctCount,
      accuracy,
      timeSpentSeconds,
      answers: evaluatedAnswers
    });

    // Update User Stats
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Increment streak if not active today
        const todayStr = new Date().toISOString().split('T')[0];
        const lastActive = user.streak?.lastActiveDate;
        let newStreak = user.streak?.current || 0;

        if (lastActive !== todayStr) {
          newStreak = newStreak + 1;
        }

        await User.findByIdAndUpdate(userId, {
          $set: {
            'streak.current': newStreak,
            'streak.longest': Math.max(newStreak, user.streak?.longest || 0),
            'streak.lastActiveDate': todayStr
          }
        });
      }
    }

    return sendSuccess(res, 'Quiz evaluated successfully', {
      attemptId: attempt._id,
      totalQuestions,
      correctAnswers: correctCount,
      accuracy,
      timeSpentSeconds,
      review: detailedReview
    });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to evaluate quiz', 500);
  }
};

// GET /api/quiz/history
export const getQuizHistory = async (req: Request, res: Response) => {
  try {
    const requestWithUser = req as any;
    const userId = requestWithUser.user?.id || requestWithUser.user?._id;

    if (!userId) {
      return sendError(res, 'User ID required', 401);
    }

    const attempts = await QuizAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return sendSuccess(res, 'Quiz history retrieved', attempts);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to retrieve quiz history', 500);
  }
};

// GET /api/quiz/analytics
export const getQuizAnalytics = async (req: Request, res: Response) => {
  try {
    const requestWithUser = req as any;
    const userId = requestWithUser.user?.id || requestWithUser.user?._id;

    if (!userId) {
      return sendError(res, 'User ID required', 401);
    }

    const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 }).lean();

    if (attempts.length === 0) {
      return sendSuccess(res, 'No quiz attempts recorded yet', {
        totalAttempted: 0,
        correctAnswers: 0,
        overallAccuracy: null,
        activeMistakes: 0,
        totalTimeSpentSeconds: 0,
        recentAttempts: []
      });
    }

    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalTime = 0;
    const mistakeQuestionIds = new Set<string>();

    for (const att of attempts) {
      totalAttempted += att.totalQuestions || 0;
      totalCorrect += att.correctAnswers || 0;
      totalTime += att.timeSpentSeconds || 0;

      for (const ans of att.answers) {
        if (!ans.isCorrect && ans.questionId) {
          mistakeQuestionIds.add(ans.questionId.toString());
        }
      }
    }

    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    return sendSuccess(res, 'Quiz analytics calculated', {
      totalAttempted,
      correctAnswers: totalCorrect,
      overallAccuracy,
      activeMistakes: mistakeQuestionIds.size,
      totalTimeSpentSeconds: totalTime,
      recentAttempts: attempts.slice(0, 5)
    });
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to calculate analytics', 500);
  }
};

