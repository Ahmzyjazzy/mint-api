-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" TEXT DEFAULT 'NG',
ALTER COLUMN "country" SET DEFAULT 'Nigeria',
ALTER COLUMN "countryDialCode" SET DEFAULT '234';
