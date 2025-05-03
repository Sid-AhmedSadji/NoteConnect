const express = require('express');
const router = express.Router();
const {validateObjectId, validateOwnerObjectId} = require('../middlewares/validateObjectId');

const {  getNotes, createNote,deleteNote, updateNote, calculNotes, pingNotes,   } = require('../controllers/noteController');

router.get('/', validateOwnerObjectId,getNotes);
router.post('/', validateOwnerObjectId,createNote);
router.put('/:id', validateObjectId, validateOwnerObjectId, updateNote);
router.delete('/:id', validateObjectId, deleteNote);
router.post('/calcul-notes', validateOwnerObjectId,calculNotes);
router.post('/ping',  pingNotes);

module.exports = router;