import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import examRoutes from './exam.routes';
import quizRoutes from './quiz.routes';
import tutorRoutes from './tutor.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes); // mount auth routes under /api/auth
router.use('/exams', examRoutes); // mount exam routes under /api/exams
router.use('/quiz', quizRoutes); // mount quiz routes under /api/quiz
router.use('/tutor', tutorRoutes); // mount tutor routes under /api/tutor

export default router;
