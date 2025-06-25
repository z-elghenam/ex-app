/*
  Warnings:

  - You are about to drop the column `stauts` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "stauts",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
