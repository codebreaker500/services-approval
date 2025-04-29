import prisma from '../prismaClient.js';

const createSettlement = async (req, res) => {
  const { id } = req.params;
  const { stockCode, amount } = req.body;

  const deposito = await prisma.deposito.findUnique({
    where: { id: parseInt(id) },
  });

  if (!deposito || deposito.status !== 'APPROVED_SETTLEMENT') {
    return res.status(400).json({ message: 'Deposito is not approved for settlement' });
  }

  const totalSettlement = await prisma.settlementDeposito.aggregate({
    _sum: { amount: true },
    where: { depositoId: parseInt(id) },
  });

  if ((totalSettlement._sum.amount || 0) + amount > deposito.placementNominal) {
    return res.status(400).json({ message: 'Settlement exceeds deposito nominal' });
  }

  const settlement = await prisma.settlementDeposito.create({
    data: {
      depositoId: parseInt(id),
      stockCode,
      amount,
    },
  });

  // Emit a Socket.IO event for settlement creation
  req.io.emit('newSettlement', {
    message: 'A new settlement has been created',
    settlement,
  });

  res.status(201).json({ message: 'Settlement created', settlement });
};

export { createSettlement };
