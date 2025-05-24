import express from 'express';
import { predictPrice, getSampleData } from '../controllers/ml.controller.js';

const router = express.Router();

router.post('/predict', predictPrice);
router.get('/sample-data', getSampleData);

export default router;
