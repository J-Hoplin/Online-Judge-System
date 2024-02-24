/*
  Warnings:

  - Added the required column `userId` to the `problem_issue_comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `problem_issue_comment` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `problem_issue_comment` ADD CONSTRAINT `problem_issue_comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
