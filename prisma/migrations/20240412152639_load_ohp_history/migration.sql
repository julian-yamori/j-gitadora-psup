-- CreateTable
CREATE TABLE "LoadOhpHistoryResult" (
    "index" INTEGER NOT NULL,
    "trackId" TEXT,
    "difficulty" INTEGER,
    "submitAchievement" DOUBLE PRECISION,
    "oldAchievement" DOUBLE PRECISION,
    "newAchievement" DOUBLE PRECISION,
    "error" TEXT,

    CONSTRAINT "LoadOhpHistoryResult_pkey" PRIMARY KEY ("index")
);

-- AddForeignKey
ALTER TABLE "LoadOhpHistoryResult" ADD CONSTRAINT "LoadOhpHistoryResult_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadOhpHistoryResult" ADD CONSTRAINT "LoadOhpHistoryResult_trackId_difficulty_fkey" FOREIGN KEY ("trackId", "difficulty") REFERENCES "Score"("trackId", "difficulty") ON DELETE SET NULL ON UPDATE CASCADE;
