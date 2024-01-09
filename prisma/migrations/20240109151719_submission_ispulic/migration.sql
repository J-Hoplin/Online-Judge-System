-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `github` VARCHAR(191) NULL,
    `blog` VARCHAR(191) NULL,
    `type` ENUM('Admin', 'Contributer', 'User') NULL DEFAULT 'User',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_nickname_key`(`nickname`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL DEFAULT 'New Problem',
    `problem` VARCHAR(191) NOT NULL DEFAULT 'Problem Here',
    `input` VARCHAR(191) NOT NULL DEFAULT 'Input Here',
    `output` VARCHAR(191) NOT NULL DEFAULT 'Output Here',
    `timeLimit` INTEGER NOT NULL DEFAULT 5,
    `memoryLimit` INTEGER NOT NULL DEFAULT 128,
    `contributerId` VARCHAR(191) NOT NULL,
    `tags` JSON NOT NULL,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `languageId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `response` ENUM('CORRECT', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEED', 'COMPILE_ERROR', 'RUNTIME_ERROR_SIGSEGV', 'RUNTIME_ERROR_SIGXFSZ', 'RUNTIME_ERROR_SIGFPE', 'RUNTIME_ERROR_SIGABRT', 'RUNTIME_ERROR_NZEC', 'RUNTIME_ERROR', 'INTERNAL_ERROR', 'EXEC_FORMAT_ERROR', 'MEMORY_LIMIT_EXCEED') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `problemId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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
ALTER TABLE `problem` ADD CONSTRAINT `problem_contributerId_fkey` FOREIGN KEY (`contributerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
