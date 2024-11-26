import express from 'express';

import { getAccount, deleteAccount, updateAccount } from '../controllers/accountController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/account', authMiddleware, getAccount);
router.delete('/account/delete', authMiddleware, deleteAccount);
router.put('/account/update', authMiddleware, updateAccount);

export default router;
