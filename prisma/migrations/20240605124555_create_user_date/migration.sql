-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "playingMemo" TEXT NOT NULL,
    "matchLvMin" DOUBLE PRECISION,
    "matchLvMax" DOUBLE PRECISION,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

INSERT INTO "UserData" ("id", "playingMemo", "matchLvMin", "matchLvMax")
VALUES ('0', '', NULL, NULL);
