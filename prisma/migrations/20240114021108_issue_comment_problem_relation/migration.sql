/*
  Warnings:

  - Added the required column `problemId` to the `problem_issue_comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `problem_issue_comment` ADD COLUMN `problemId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `problem_issue_comment` ADD CONSTRAINT `problem_issue_comment_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
