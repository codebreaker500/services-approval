const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Dealers
  const dealer1 = await prisma.dealer.create({
    data: {
      email: 'dealer1@example.com',
      NIK: '1234567890123456',
      phoneNumber: '081234567890',
      address: 'Jl. Sudirman No.1',
      confirmed: true,
    },
  });

  const dealer2 = await prisma.dealer.create({
    data: {
      email: 'dealer2@example.com',
      NIK: '6543210987654321',
      phoneNumber: '081987654321',
      address: 'Jl. Thamrin No.2',
      confirmed: false,
    },
  });

  // 2. Create Users (with roles)
  const users = await prisma.user.createMany({
    data: [
      {
        dealerId: dealer1.id,
        name: 'Dealer One',
        email: 'dealer1.user@example.com',
        password: hashedPassword,
        role: 'DEALER',
      },
      {
        name: 'Assistant Deputy Investment',
        email: 'asdep.inv@example.com',
        password: hashedPassword,
        role: 'ASSISTANT_DEPUTY_INVESTMENT',
      },
      {
        name: 'Deputy Investment',
        email: 'dep.inv@example.com',
        password: hashedPassword,
        role: 'DEPUTY_INVESTMENT',
      },
      {
        name: 'Director Investment',
        email: 'dir.inv@example.com',
        password: hashedPassword,
        role: 'DIRECTOR_INVESTMENT',
      },
      {
        name: 'Assistant Deputy Settlement',
        email: 'asdep.settle@example.com',
        password: hashedPassword,
        role: 'ASSISTANT_DEPUTY_SETTLEMENT',
      },
      {
        name: 'Deputy Settlement',
        email: 'dep.settle@example.com',
        password: hashedPassword,
        role: 'DEPUTY_SETTLEMENT',
      },
      {
        name: 'Settlement Arranger',
        email: 'arranger@example.com',
        password: hashedPassword,
        role: 'SETTLEMENT_ARRANGER',
      },
    ],
  });

  // 3. Create Deposito
  const deposito1 = await prisma.deposito.create({
    data: {
      dealerId: dealer1.id,
      placementDate: new Date(),
      placementNominal: 100000000, // 100 juta
      tenor: 6, // 6 bulan
      status: 'PENDING',
    },
  });

  // 4. Create Approvals for Deposito
  const createdUsers = await prisma.user.findMany();

  const approvalData = createdUsers.map(user => ({
    depositoId: deposito1.id,
    userId: user.id,
    role: user.role,
    status: 'PENDING',
  }));

  await prisma.approval.createMany({
    data: approvalData,
  });

  // 5. Settlement Example
  await prisma.settlementDeposito.create({
    data: {
      depositoId: deposito1.id,
      stockCode: 'BNI01',
      amount: 100000000,
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
