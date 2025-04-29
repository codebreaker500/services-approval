import express from "express";
import { registerDealer, confirmEmail, createUserForDealer, login } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register-dealer', registerDealer);
router.get('/confirm-email/:id', confirmEmail);
router.post('/create-user', createUserForDealer);

export default router;