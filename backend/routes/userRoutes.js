import express from 'express';
import { validateObjectId } from '../middlewares/validateObjectId.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  me,
  verifyPassword
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authMiddleware, me);
router.post('/', createUser);
router.put('/:id', authMiddleware, validateObjectId, updateUser);
router.delete('/:id', authMiddleware, validateObjectId, deleteUser);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/verify-password', authMiddleware, verifyPassword);

export default router;
