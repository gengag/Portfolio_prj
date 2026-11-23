import { Router } from 'express';
import { getQuestions, submitQuiz, getQuizHistory, getQuizAnalytics } from '../controllers/quiz.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/quiz/questions - Fetch practice questions
router.get('/questions', getQuestions);

// POST /api/quiz/submit - Submit answers and evaluate (protected)
router.post('/submit', verifyToken, submitQuiz);

// GET /api/quiz/history - Get past quiz attempts (protected)
router.get('/history', verifyToken, getQuizHistory);

// GET /api/quiz/analytics - Get aggregated user statistics (protected)
router.get('/analytics', verifyToken, getQuizAnalytics);

export default router;

