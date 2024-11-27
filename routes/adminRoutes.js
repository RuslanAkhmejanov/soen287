import express from 'express';

import {
    getSignInAdmin,
    signInAdmin,
    getAdmin,
    signOutAdmin,
    updateBusinessInfo
} from '../controllers/adminController.js';

import { uploadMulterFields } from '../middlewares/upload.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/admin/signin', getSignInAdmin);
router.post('/admin/signin', signInAdmin);
router.post('/admin/signout', adminAuthMiddleware, signOutAdmin);
router.post('/admin/update', adminAuthMiddleware, uploadMulterFields, updateBusinessInfo);
router.get('/admin', adminAuthMiddleware, getAdmin);

export default router;
