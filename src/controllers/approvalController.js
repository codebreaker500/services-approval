import prisma from '../prismaClient.js';

const getApprovalHistory = async (req, res) => {
  const { id } = req.params;

  const approvals = await prisma.approval.findMany({
    where: { depositoId: parseInt(id) },
    include: { user: true },
  });

  res.json(approvals);
};

const approveTransaction = async (req, res) => {
  const { depositoId, userId, role, status } = req.body;
  try {
    const approval = await prisma.approval.create({
      data: {
        depositoId,
        userId,
        role,
        status,
      },
    });

    // Update Deposito status based on approvals
    if (role === 'ASSISTANT_DEPUTY_INVESTMENT' && status === 'APPROVED') {
      await prisma.deposito.update({
        where: { id: depositoId },
        data: { status: 'APPROVED_INVESTMENT' },
      });
    } else if (role === 'ASSISTANT_DEPUTY_SETTLEMENT' && status === 'APPROVED') {
      await prisma.deposito.update({
        where: { id: depositoId },
        data: { status: 'APPROVED_SETTLEMENT' },
      });
    }

    res.status(200).json({ message: 'Approval processed.', approval });
  } catch (error) {
    console.error('Error approving deposito:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getApprovalHistory, approveTransaction};