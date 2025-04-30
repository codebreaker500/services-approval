import express from "express";
import { registerDealer, confirmEmail, createUserForDealer, login, getProfile } from '../controllers/authController.js';
import { authenticate } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/login', login);
router.post('/register-dealer', registerDealer);
router.get('/confirm-email/:id', confirmEmail);
router.get('/user', authenticate, getProfile);
router.post('/create-user', createUserForDealer);

export default router;