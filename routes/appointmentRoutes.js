// routes/appointmentRoutes.js
import express from 'express';
import { getAppointment, createAppointment, cancelAppointment, approveAppointment } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/book', authMiddleware, getAppointment);
// Route to create an appointment
router.post('/book', authMiddleware, createAppointment);
router.patch('/appointments/:id', authMiddleware, approveAppointment);
router.delete('/appointments/:id', authMiddleware, cancelAppointment);

export default router;
