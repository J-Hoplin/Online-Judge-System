-- CreateTable
CREATE TABLE `problem_issue_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `problemId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `problem_issue_comment` ADD CONSTRAINT `problem_issue_comment_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem_issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
