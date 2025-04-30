/*
  Warnings:

  - Added the required column `rate` to the `Deposito` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposito" ADD COLUMN     "rate" INTEGER NOT NULL;
