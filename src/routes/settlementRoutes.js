import express from "express";
import { createSettlement } from '../controllers/settlementController.js';
import { authenticate } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/:id/settle', authenticate, createSettlement);

export default router;