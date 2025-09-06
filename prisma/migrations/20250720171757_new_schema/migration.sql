/*
  Warnings:

  - A unique constraint covering the columns `[nomorKontrak]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "kontrak"."Contract" ADD COLUMN     "nomorKontrak" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contract_nomorKontrak_key" ON "kontrak"."Contract"("nomorKontrak");
