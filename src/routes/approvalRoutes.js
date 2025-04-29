import express from "express";
import { approveTransaction, getApprovalHistory } from '../controllers/approvalController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router({ mergeParams: true });

router.post('/', authenticate, approveTransaction);
router.get('/history', authenticate, getApprovalHistory);

export default router;