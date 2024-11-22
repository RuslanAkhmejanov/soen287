import express from 'express';

import {
    getSignUp, createUser,
    getSignIn, signInUser,
    signOutUser, getSignInAdmin,
    signInAdmin, getAdmin
} from '../controllers/authController.js';

const router = express.Router();

router.get('/signup', getSignUp);
router.post('/signup', createUser);
router.get('/signin', getSignIn);
router.post('/signin', signInUser);
router.post('/signout', signOutUser);
router.get('/admin/signin', getSignInAdmin);
router.post('/admin/signin', signInAdmin);
router.get('/admin', getAdmin);

export default router;
