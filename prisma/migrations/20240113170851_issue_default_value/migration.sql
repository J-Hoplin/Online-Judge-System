-- AlterTable
ALTER TABLE `problem_issue` MODIFY `title` VARCHAR(100) NOT NULL DEFAULT 'Title Here',
    MODIFY `content` TEXT NOT NULL DEFAULT 'Content Here';
