/*
  Warnings:

  - You are about to drop the column `targetId` on the `problem_issue` table. All the data in the column will be lost.
  - Added the required column `problemId` to the `problem_issue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `problem_issue` DROP FOREIGN KEY `problem_issue_targetId_fkey`;

-- AlterTable
ALTER TABLE `problem_issue` DROP COLUMN `targetId`,
    ADD COLUMN `problemId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `problem_issue` ADD CONSTRAINT `problem_issue_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
