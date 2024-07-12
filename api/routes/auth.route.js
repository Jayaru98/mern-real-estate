import { google, signin, signOut, signup } from "../controllers/auth.controller.js";
import express from 'express';

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)
router.get('/signOut', signOut)

export default router;