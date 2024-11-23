import express from 'express';
import { saveBusinessInfo } from '../controllers/businessController.js';
import { uploadBusinessAssets, uploadEmployeeImages } from '../middlewares/upload.js';

const router = express.Router();

// Route for saving business information
router.post(
    '/business',
    (req, res, next) => {
        uploadBusinessAssets(req, res, (err) => {
            if (err) return next(err);
            uploadEmployeeImages(req, res, next);
        });
    },
    saveBusinessInfo
);

export default router;

