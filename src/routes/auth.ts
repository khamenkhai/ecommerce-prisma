import { Router } from 'express';
import { register, login, me } from '../controllers/auth_controller';
import authMiddleware from '../middlewares/auth';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/me',  [authMiddleware], me);

export default authRoutes;
