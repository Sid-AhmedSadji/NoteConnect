import express from 'express';
import { validateObjectId, validateOwnerObjectId } from '../middlewares/validateObjectId.js';
import { getChecks, getChecksPending, validateCheck } from '../controllers/checkController.js';
const router = express.Router();

router.get('/',getChecks);
router.get('/pending',getChecksPending);
router.post('/validate/:id', validateCheck);


export default router;