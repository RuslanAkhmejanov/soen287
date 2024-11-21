import express from 'express';

import { getSignUp, createUser, getSignIn, signInUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/signup', getSignUp);
router.post('/signup', createUser);
router.get('/signin', getSignIn);
router.post('/signin', signInUser);

export default router;
