-- CreateTable
CREATE TABLE "user_referrals" (
    "id" SERIAL NOT NULL,
    "newUserId" INTEGER NOT NULL,
    "refereeUserId" INTEGER NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_referrals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_newUserId_fkey" FOREIGN KEY ("newUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_refereeUserId_fkey" FOREIGN KEY ("refereeUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
