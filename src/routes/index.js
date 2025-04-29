import express from "express";
import authRoutes from './authRoutes.js';
import approvalRoutes from './approvalRoutes.js';
import depositoRoutes from './depositoRoutes.js';
import settlementRoutes from './settlementRoutes.js'; 
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions/:id/approvals', (req, res, next) => {
  const transactionId = req.params.id;
  if (!transactionId || isNaN(transactionId)) {
    return res.status(400).json({ error: 'Invalid transaction ID' });
  }

  req.transactionId = transactionId; 
  next();
}, approvalRoutes);

router.use('/depositos', depositoRoutes);
router.use('/settlements', settlementRoutes);

router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default router;