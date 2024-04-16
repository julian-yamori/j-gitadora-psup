/*
  Warnings:

  - You are about to drop the `WikiLoadingDiffirence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WikiLoadingIssue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WikiLoadingNewScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WikiLoadingNewTrack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WikiLoadingDiffirence" DROP CONSTRAINT "WikiLoadingDiffirence_issueId_fkey";

-- DropForeignKey
ALTER TABLE "WikiLoadingNewScore" DROP CONSTRAINT "WikiLoadingNewScore_trackId_fkey";

-- DropForeignKey
ALTER TABLE "WikiLoadingNewTrack" DROP CONSTRAINT "WikiLoadingNewTrack_id_fkey";

-- DropTable
DROP TABLE "WikiLoadingDiffirence";

-- DropTable
DROP TABLE "WikiLoadingIssue";

-- DropTable
DROP TABLE "WikiLoadingNewScore";

-- DropTable
DROP TABLE "WikiLoadingNewTrack";
