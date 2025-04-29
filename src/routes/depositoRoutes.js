import express from "express";
import { createDeposito, listDepositos, getDepositoDetails } from '../controllers/depositoController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/create', authenticate, createDeposito);
router.get('/', authenticate, listDepositos);
router.get('/:id', authenticate, getDepositoDetails);

export default router;