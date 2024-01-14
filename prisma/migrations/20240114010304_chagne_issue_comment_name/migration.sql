/*
  Warnings:

  - You are about to drop the column `problemId` on the `problem_issue_comment` table. All the data in the column will be lost.
  - Added the required column `issueId` to the `problem_issue_comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `problem_issue_comment` DROP FOREIGN KEY `problem_issue_comment_problemId_fkey`;

-- AlterTable
ALTER TABLE `problem_issue` MODIFY `title` VARCHAR(100) NOT NULL DEFAULT 'Title Here';

-- AlterTable
ALTER TABLE `problem_issue_comment` DROP COLUMN `problemId`,
    ADD COLUMN `issueId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `problem_issue_comment` ADD CONSTRAINT `problem_issue_comment_issueId_fkey` FOREIGN KEY (`issueId`) REFERENCES `problem_issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
