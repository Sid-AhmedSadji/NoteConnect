const express = require('express');
const userRoutes = require('./userRoutes');
const NoteRoutes = require('./noteRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/notes', authMiddleware, NoteRoutes);

module.exports = router;