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
CREATE TABLE "TrackUser" (
    "id" TEXT NOT NULL,
    "like" INTEGER,
    "isOpen" BOOLEAN NOT NULL,
    "memo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackUserByDifficulty" (
    "trackId" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "achievement" DOUBLE PRECISION NOT NULL,
    "failed" BOOLEAN NOT NULL,
    "skillPoint" DOUBLE PRECISION NOT NULL,
    "wishPractice" BOOLEAN NOT NULL,
    "wishAchievement" BOOLEAN NOT NULL,
    "wishEvent" BOOLEAN NOT NULL,
    "wishNextPick" BOOLEAN NOT NULL,
    "wishPlayed" BOOLEAN NOT NULL,
    "movieURL" TEXT NOT NULL
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
CREATE UNIQUE INDEX "Track_title_key" ON "Track"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TrackByDifficulty_trackId_difficulty_key" ON "TrackByDifficulty"("trackId", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "TrackUserByDifficulty_trackId_difficulty_key" ON "TrackUserByDifficulty"("trackId", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "WikiLoadingNewTrackByDifficulty_trackId_difficulty_key" ON "WikiLoadingNewTrackByDifficulty"("trackId", "difficulty");

-- AddForeignKey
ALTER TABLE "TrackByDifficulty" ADD CONSTRAINT "TrackByDifficulty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackUser" ADD CONSTRAINT "TrackUser_id_fkey" FOREIGN KEY ("id") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackUserByDifficulty" ADD CONSTRAINT "TrackUserByDifficulty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "TrackUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackUserByDifficulty" ADD CONSTRAINT "TrackUserByDifficulty_trackId_difficulty_fkey" FOREIGN KEY ("trackId", "difficulty") REFERENCES "TrackByDifficulty"("trackId", "difficulty") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiLoadingNewTrack" ADD CONSTRAINT "WikiLoadingNewTrack_id_fkey" FOREIGN KEY ("id") REFERENCES "WikiLoadingIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiLoadingNewTrackByDifficulty" ADD CONSTRAINT "WikiLoadingNewTrackByDifficulty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "WikiLoadingNewTrack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiLoadingDiffirence" ADD CONSTRAINT "WikiLoadingDiffirence_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "WikiLoadingIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
