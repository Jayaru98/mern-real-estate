import { verifyToken } from '../utils/verifyUser.js';
import express from 'express';
import { createListingHandler,deleteListing, updateListing } from '../controllers/listing.controller.js'

const router = express.Router();

router.post ('/create' ,verifyToken,createListingHandler);
router.delete('/delete/:id',verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);

export default router;