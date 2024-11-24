import express from 'express';

import { getAccount } from '../controllers/accountController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/account', authMiddleware, getAccount);

export default router;
