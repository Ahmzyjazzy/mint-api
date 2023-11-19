/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccount" DROP CONSTRAINT "UserAccount_accountId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccount" DROP CONSTRAINT "UserAccount_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserAccount";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT DEFAULT 'Nigeria',
    "countryCode" TEXT DEFAULT 'NG',
    "countryDialCode" TEXT DEFAULT '234',
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "bvnVerifiedAt" TIMESTAMP(3),
    "accountVerifiedAt" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "forcePasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "useTwoFactor" BOOLEAN NOT NULL DEFAULT false,
    "txnPincode" TEXT,
    "accountTier" TEXT,
    "accountPnd" BOOLEAN NOT NULL DEFAULT false,
    "accountPndReason" TEXT,
    "referralId" TEXT,
    "referralLink" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedRequest" BOOLEAN NOT NULL DEFAULT false,
    "deletedStatus" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "avatar" TEXT,
    "title" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "middleName" TEXT,
    "gender" TEXT,
    "dateOfBirth" TEXT,
    "nationality" TEXT,
    "stateOfOrigin" TEXT,
    "lgaOfOrigin" TEXT,
    "maritalStatus" TEXT,
    "maidenName" TEXT,
    "contactAddress" TEXT,
    "contactLga" TEXT,
    "contactState" TEXT,
    "contactLandmark" TEXT,
    "nokName" TEXT,
    "nokRelationship" TEXT,
    "nokDateOfBirth" TEXT,
    "nokEmail" TEXT,
    "nokPhone" TEXT,
    "nokAddress" TEXT,
    "employmentStatus" BOOLEAN,
    "employmentType" TEXT,
    "employmentOccupation" TEXT,
    "employmentEmployer" TEXT,
    "employmentOfficeAddress" TEXT,
    "employmentDateEmployed" TEXT,
    "bvn" TEXT,
    "bvnFirstName" TEXT,
    "bvnLastName" TEXT,
    "bvnMiddleName" TEXT,
    "bvnEmail" TEXT,
    "bvnPhone1" TEXT,
    "bvnPhone2" TEXT,
    "bvnAvatar" TEXT,
    "bvnJson" TEXT,
    "nin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountNumber" INTEGER,
    "accountId" INTEGER NOT NULL,
    "subAccountId" INTEGER,
    "postNoDebit" BOOLEAN NOT NULL DEFAULT false,
    "previousBalance" TEXT,
    "accountBalance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralId_key" ON "users"("referralId");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralLink_key" ON "users"("referralLink");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_name_key" ON "accounts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_userId_key" ON "user_accounts"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
