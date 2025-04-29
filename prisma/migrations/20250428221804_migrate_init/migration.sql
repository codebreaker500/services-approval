-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEALER', 'ASSISTANT_DEPUTY_INVESTMENT', 'DEPUTY_INVESTMENT', 'DIRECTOR_INVESTMENT', 'ASSISTANT_DEPUTY_SETTLEMENT', 'DEPUTY_SETTLEMENT', 'SETTLEMENT_ARRANGER');

-- CreateEnum
CREATE TYPE "DepositoStatus" AS ENUM ('PENDING', 'APPROVED_INVESTMENT', 'APPROVED_SETTLEMENT', 'SETTLED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Dealer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "NIK" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "dealerId" INTEGER,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposito" (
    "id" SERIAL NOT NULL,
    "dealerId" INTEGER NOT NULL,
    "placementDate" TIMESTAMP(3) NOT NULL,
    "placementNominal" DOUBLE PRECISION NOT NULL,
    "tenor" INTEGER NOT NULL,
    "status" "DepositoStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" SERIAL NOT NULL,
    "depositoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementDeposito" (
    "id" SERIAL NOT NULL,
    "depositoId" INTEGER NOT NULL,
    "stockCode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementDeposito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_email_key" ON "Dealer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_NIK_key" ON "Dealer"("NIK");

-- CreateIndex
CREATE UNIQUE INDEX "User_dealerId_key" ON "User"("dealerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Deposito" ADD CONSTRAINT "Deposito_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementDeposito" ADD CONSTRAINT "SettlementDeposito_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "Deposito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
