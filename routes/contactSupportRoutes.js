import express from 'express';

import { sendRequest } from '../controllers/contactSupportController.js'

const router = express.Router();

router.post('/contact', sendRequest);

export default router;
