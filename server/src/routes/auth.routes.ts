import { Router } from 'express';
import { register, login, me, updateMe } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register); // POST /api/auth/register
router.post('/login', login);       // POST /api/auth/login

// Protected route – requires a valid JWT
router.get('/me', verifyToken, me); // GET /api/auth/me
router.put('/me', verifyToken, updateMe); // PUT /api/auth/me

export default router;

