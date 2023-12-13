-- AlterTable
ALTER TABLE `user` MODIFY `type` ENUM('Admin', 'Contributer', 'User') NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE `problem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `problem` VARCHAR(191) NOT NULL,
    `input` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,
    `timeLimit` INTEGER NOT NULL,
    `memoryLimit` INTEGER NOT NULL,
    `contributerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `problemexample` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `input` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,
    `isPublic` BOOLEAN NOT NULL,
    `problemId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `problem` ADD CONSTRAINT `problem_contributerId_fkey` FOREIGN KEY (`contributerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `problemexample` ADD CONSTRAINT `problemexample_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
