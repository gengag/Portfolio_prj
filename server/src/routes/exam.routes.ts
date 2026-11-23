import { Router } from 'express';
import { getExams, getExamDetails, seedExams } from '../controllers/exam.controller';

const router = Router();

// GET /api/exams - list all available exams
router.get('/', getExams);

// GET /api/exams/:id - get an exam with its subjects and topics
router.get('/:id', getExamDetails);

// POST /api/exams/seed - manually seed exam data
router.post('/seed', seedExams);

export default router;

