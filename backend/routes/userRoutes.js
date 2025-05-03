const express = require('express');
const router = express.Router();
const {validateObjectId} = require('../middlewares/validateObjectId');
const authMiddleware = require('../middlewares/authMiddleware');

const { createUser, updateUser, deleteUser, login, logout, me, verifyPassword } = require('../controllers/userController');

router.get('/me', authMiddleware, me);
router.post('/', createUser);
router.put('/:id',authMiddleware, validateObjectId, updateUser);
router.delete('/:id',authMiddleware, validateObjectId, deleteUser);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/verify-password', authMiddleware, verifyPassword);

module.exports = router;