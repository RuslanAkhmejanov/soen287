import express from 'express';

import {
    getSignUp, createUser,
    getSignIn, signInUser,
    signOutUser
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/signup', getSignUp);
router.post('/signup', createUser);
router.get('/signin', getSignIn);
router.post('/signin', signInUser);
router.post('/signout', authMiddleware, signOutUser);

export default router;
