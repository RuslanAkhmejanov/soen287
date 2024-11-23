import multer from 'multer';
import path from 'path';

// Configure the storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

// Middleware for business-related assets
export const uploadBusinessAssets = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max file size: 10 MB
        files: 15, // Total max files allowed
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Allow only image files
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
}).fields([
    { name: 'logo', maxCount: 1 }, // Single logo image
    { name: 'pictures', maxCount: 10 }, // Multiple business pictures
]);

// Middleware for dynamically added employee images
export const uploadEmployeeImages = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max file size per file: 10 MB
        files: 10, // Limit total number of files for employees
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Allow only image files
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
}).fields([
    { name: 'employees[0][image]', maxCount: 1 },
    { name: 'employees[1][image]', maxCount: 1 },
    { name: 'employees[2][image]', maxCount: 1 },
    { name: 'employees[3][image]', maxCount: 1 },
    { name: 'employees[4][image]',maxCount: 1 },
    // Add more fields as needed to handle more employee images dynamically
]);
