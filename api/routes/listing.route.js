import { verifyToken } from '../utils/verifyUser.js';
import express from 'express';
import { createListingHandler } from '../controllers/listing.controller.js'

const router = express.Router();

router.post ('/create' ,verifyToken,createListingHandler)

export default router;