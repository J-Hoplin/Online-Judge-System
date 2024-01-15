-- DropForeignKey
ALTER TABLE `problem_issue_comment` DROP FOREIGN KEY `problem_issue_comment_problemId_fkey`;

-- AlterTable
ALTER TABLE `problem` ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `problem_issue_comment` ADD CONSTRAINT `problem_issue_comment_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
