import express from 'express';
import { saveBusinessInfo } from '../controllers/businessController.js';
import { uploadBusinessAssets, uploadStaffMemberImages, uploadServiceImages } from '../middlewares/upload.js'; // Ensure the path is correct

const router = express.Router(); // Initialize the router

// Business route
router.post('/business', (req, res, next) => {
  uploadBusinessAssets(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading business assets', error: err.message });
    }

    uploadStaffMemberImages(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading staff member images', error: err.message });
      }

      uploadServiceImages(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading service images', error: err.message });
        }

        try {
          console.log('Request Body:', req.body);
          console.log('Request Files:', req.files);

          await saveBusinessInfo(req, res);
        } catch (error) {
          console.error('Error saving business information:', error);
          res.status(500).json({ message: 'Error saving business information', error: error.message });
        }
      });
    });
  });
});

export default router; // Export the router

