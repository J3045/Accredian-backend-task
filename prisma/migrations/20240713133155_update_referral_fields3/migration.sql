/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Referral` ADD COLUMN `referralCode` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Referral_referralCode_key` ON `Referral`(`referralCode`);
