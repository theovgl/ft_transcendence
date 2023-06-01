/*
  Warnings:

  - Added the required column `scoreUser1` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoreUser2` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "scoreUser1" INTEGER NOT NULL,
ADD COLUMN     "scoreUser2" INTEGER NOT NULL;
