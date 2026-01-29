import express from 'express';
import { validateObjectId } from '../middlewares/validateObjectId.js';
import { getChecks, getChecksPending, validateCheck, actualiseCheck } from '../controllers/checkController.js';
const router = express.Router();

router.get('/',getChecks);
router.get('/pending',getChecksPending);
router.post('/validate/:id',validateObjectId,validateCheck);
router.put('/refresh/:id',validateObjectId,actualiseCheck);

export default router;