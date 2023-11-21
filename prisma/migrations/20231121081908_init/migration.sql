-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "skillType" INTEGER NOT NULL,
    "long" BOOLEAN NOT NULL,
    "openType" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL,
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

-- CreateTable
CREATE TABLE "WikiLoadingIssue" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT,
    "rowNo" INTEGER,
    "errorMessage" TEXT,

    CONSTRAINT "WikiLoadingIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiLoadingNewTrack" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "skillType" INTEGER NOT NULL,
    "long" BOOLEAN NOT NULL,
    "openType" INTEGER NOT NULL,

    CONSTRAINT "WikiLoadingNewTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiLoadingNewTrackByDifficulty" (
    "trackId" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "lv" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "WikiLoadingDiffirence" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "difficulty" INTEGER,
    "oldValue" TEXT,
    "newValue" TEXT,

    CONSTRAINT "WikiLoadingDiffirence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackByDifficulty_trackId_difficulty_key" ON "TrackByDifficulty"("trackId", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "WikiLoadingNewTrackByDifficulty_trackId_difficulty_key" ON "WikiLoadingNewTrackByDifficulty"("trackId", "difficulty");

-- AddForeignKey
ALTER TABLE "TrackByDifficulty" ADD CONSTRAINT "TrackByDifficulty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiLoadingNewTrack" ADD CONSTRAINT "WikiLoadingNewTrack_id_fkey" FOREIGN KEY ("id") REFERENCES "WikiLoadingIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiLoadingNewTrackByDifficulty" ADD CONSTRAINT "WikiLoadingNewTrackByDifficulty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "WikiLoadingNewTrack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiLoadingDiffirence" ADD CONSTRAINT "WikiLoadingDiffirence_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "WikiLoadingIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
