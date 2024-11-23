import express from 'express';
import { addService, deleteService } from '../controllers/serviceController.js';

const router = express.Router();

// Route to add a service
router.post('/services', addService);

// Route to delete a service
router.post('/services/:id/delete', deleteService);

export default router;
