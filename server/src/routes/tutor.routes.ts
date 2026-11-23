import { Router } from 'express';
import { askTutor } from '../controllers/tutor.controller';

const router = Router();

// POST /api/tutor/chat
router.post('/chat', askTutor);

export default router;

