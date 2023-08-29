-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "skillType" INTEGER NOT NULL,
    "long" BOOLEAN NOT NULL,
    "openType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackByDifficulty" (
    "trackId" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "lv" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackByDifficulty_trackId_difficulty_key" ON "TrackByDifficulty"("trackId", "difficulty");

-- AddForeignKey
ALTER TABLE "TrackByDifficulty" ADD CONSTRAINT "TrackByDifficulty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
