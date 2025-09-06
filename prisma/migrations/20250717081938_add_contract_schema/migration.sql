-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "kontrak";

-- CreateTable
CREATE TABLE "kontrak"."Contract" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "departemen" TEXT NOT NULL,
    "posisiJabatan" TEXT NOT NULL,
    "atasanLangsung" TEXT NOT NULL,
    "jenisKontrak" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalBerakhir" TIMESTAMP(3) NOT NULL,
    "durasiKontrak" TEXT NOT NULL,
    "periodeReview" TEXT,
    "gajiPokok" INTEGER NOT NULL,
    "tunjangan" INTEGER,
    "uangMakan" INTEGER NOT NULL,
    "uangTransport" INTEGER,
    "templateKontrak" TEXT,
    "dokumenKontrak" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "kontrak"."Contract" ADD CONSTRAINT "Contract_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "karyawan"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
