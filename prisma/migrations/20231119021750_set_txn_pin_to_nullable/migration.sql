/*
  Warnings:

  - Added the required column `accountNumber` to the `UserAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "txnPincode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserAccount" ADD COLUMN     "accountNumber" INTEGER NOT NULL,
ADD COLUMN     "subAccountId" INTEGER;
