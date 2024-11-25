import express from 'express';

import {
    getSignInAdmin,
    signInAdmin,
    getAdmin,
    signOutAdmin
} from '../controllers/adminController.js';

import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/admin/signin', getSignInAdmin);
router.post('/admin/signin', signInAdmin);
router.post('/admin/signout', adminAuthMiddleware, signOutAdmin);
router.get('/admin', adminAuthMiddleware, getAdmin);

export default router;
