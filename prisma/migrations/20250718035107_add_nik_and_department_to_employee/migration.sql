/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idDepartment` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "karyawan"."Employee" ADD COLUMN     "idDepartment" TEXT NOT NULL,
ADD COLUMN     "nik" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_nik_key" ON "karyawan"."Employee"("nik");

-- AddForeignKey
ALTER TABLE "karyawan"."Employee" ADD CONSTRAINT "Employee_idDepartment_fkey" FOREIGN KEY ("idDepartment") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
