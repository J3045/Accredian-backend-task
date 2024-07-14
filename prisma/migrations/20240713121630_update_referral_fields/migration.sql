/*
  Warnings:

  - You are about to drop the column `course` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `referee` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the column `referrer` on the `Referral` table. All the data in the column will be lost.
  - Added the required column `refereeEmail` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refereeName` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrerEmail` to the `Referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrerName` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Referral` DROP COLUMN `course`,
    DROP COLUMN `email`,
    DROP COLUMN `referee`,
    DROP COLUMN `referrer`,
    ADD COLUMN `refereeEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `refereeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `referrerEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `referrerName` VARCHAR(191) NOT NULL;
