import express from 'express';
import { validateObjectId, validateOwnerObjectId } from '../middlewares/validateObjectId.js';
import { getNotes, createNote, deleteNote, updateNote, calculNotes, pingNotes } from '../controllers/noteController.js';

const router = express.Router();

router.get('/', validateOwnerObjectId, getNotes);
router.post('/', validateOwnerObjectId, createNote);
router.put('/:id', validateObjectId, validateOwnerObjectId, updateNote);
router.delete('/:id', validateObjectId, deleteNote);
router.post('/calcul-notes', validateOwnerObjectId, calculNotes);
router.post('/ping', pingNotes);

export default router;