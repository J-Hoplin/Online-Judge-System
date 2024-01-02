/*
  Warnings:

  - You are about to drop the `problemexample` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tags` to the `problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `problemexample` DROP FOREIGN KEY `problemexample_problemId_fkey`;

-- AlterTable
ALTER TABLE `problem` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tags` JSON NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL DEFAULT 'New Problem',
    MODIFY `problem` VARCHAR(191) NOT NULL DEFAULT 'Problem Here',
    MODIFY `input` VARCHAR(191) NOT NULL DEFAULT 'Input Here',
    MODIFY `output` VARCHAR(191) NOT NULL DEFAULT 'Output Here',
    MODIFY `timeLimit` INTEGER NOT NULL DEFAULT 5,
    MODIFY `memoryLimit` INTEGER NOT NULL DEFAULT 128;

-- DropTable
DROP TABLE `problemexample`;

-- CreateTable
CREATE TABLE `problem_example` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `input` VARCHAR(191) NOT NULL DEFAULT '',
    `output` VARCHAR(191) NOT NULL DEFAULT '',
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `problemId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `codeLength` INTEGER NOT NULL DEFAULT 0,
    `memory` DOUBLE NOT NULL DEFAULT 0,
    `time` DOUBLE NOT NULL DEFAULT 0,
    `languageId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `response` ENUM('CORRECT', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEED', 'COMPILE_ERROR', 'RUNTIME_ERROR_SIGSEGV', 'RUNTIME_ERROR_SIGXFSZ', 'RUNTIME_ERROR_SIGFPE', 'RUNTIME_ERROR_SIGABRT', 'RUNTIME_ERROR_NZEC', 'RUNTIME_ERROR', 'INTERNAL_ERROR', 'EXEC_FORMAT_ERROR', 'MEMORY_LIMIT_EXCEED') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `problemId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem_issue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `content` TEXT NOT NULL,
    `targetId` INTEGER NOT NULL,
    `issuerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `problem_example` ADD CONSTRAINT `problem_example_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission` ADD CONSTRAINT `submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submission` ADD CONSTRAINT `submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `problem_issue` ADD CONSTRAINT `problem_issue_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `problem_issue` ADD CONSTRAINT `problem_issue_issuerId_fkey` FOREIGN KEY (`issuerId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
