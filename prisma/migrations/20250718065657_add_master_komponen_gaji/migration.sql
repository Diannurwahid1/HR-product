-- CreateTable
CREATE TABLE "public"."MasterKomponenGaji" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "defaultNominal" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "MasterKomponenGaji_pkey" PRIMARY KEY ("id")
);
