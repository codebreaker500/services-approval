import prisma from '../prismaClient.js';

const createDeposito = async (req, res) => {
  const { dealerId, placementDate, placementNominal, tenor } = req.body;
  try {
    const deposito = await prisma.deposito.create({
      data: {
        dealerId,
        placementDate: new Date(placementDate),
        placementNominal,
        tenor,
        status: 'PENDING',
      },
    });

    req.io.emit('newDeposito', {
      message: 'A new deposito request has been created',
      deposito,
    });

    res.status(201).json({ message: 'Deposito created.', deposito });
  } catch (error) {
    console.error('Error creating deposito:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const listDepositos = async (req, res) => {
  const depositos = await prisma.deposito.findMany();
  
  res.json(depositos);
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