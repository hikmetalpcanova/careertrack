/*
  Warnings:

  - Made the column `userId` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "userId" SET NOT NULL;
