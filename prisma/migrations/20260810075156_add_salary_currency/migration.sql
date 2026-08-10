/*
  Warnings:

  - You are about to drop the column `availableFrom` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetter` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `expectedSalary` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "availableFrom",
DROP COLUMN "coverLetter",
DROP COLUMN "expectedSalary";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "salaryCurrency" TEXT NOT NULL DEFAULT 'PKR';
