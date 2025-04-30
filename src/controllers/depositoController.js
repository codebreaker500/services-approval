import prisma from '../prismaClient.js';
import jwt from 'jsonwebtoken';

const createDeposito = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const { placementNominal, tenor, rate } = req.body;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { dealerId } = decoded;

    const deposito = await prisma.deposito.create({
      data: {
        dealerId,
        placementDate: new Date(),
        placementNominal,
        tenor,
        rate,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Deposito created.', deposito });
  } catch (error) {
    console.error('Error creating deposito:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const listDepositos = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { role, dealerId } = decoded;

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let depositos;
    let totalCount;

    if (role === 'DEALER') {
      totalCount = await prisma.deposito.count({
        where: { dealerId },
      });
      depositos = await prisma.deposito.findMany({
        where: { dealerId },
        skip: parseInt(skip),
        take: parseInt(limit),
      });
    } else {
      totalCount = await prisma.deposito.count();
      depositos = await prisma.deposito.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
      });
    }

    res.json({
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      depositos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDepositoDetails = async (req, res) => {
  const { id } = req.params;
  const deposito = await prisma.deposito.findUnique({
    where: { id: parseInt(id) },
  });

  if (!deposito) {
    return res.status(404).json({ message: 'Deposito not found' });
  }

  res.json(deposito);
};

export { createDeposito, listDepositos, getDepositoDetails };