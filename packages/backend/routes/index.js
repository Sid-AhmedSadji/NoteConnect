import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import userRoutes from './userRoutes.js';
import noteRoutes from './noteRoutes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/notes', authMiddleware, noteRoutes);

export default router;