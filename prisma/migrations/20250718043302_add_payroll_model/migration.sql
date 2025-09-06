-- CreateTable
CREATE TABLE "public"."Payroll" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "periodeBulan" INTEGER NOT NULL,
    "periodeTahun" INTEGER NOT NULL,
    "tanggalProses" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalGaji" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "slipUrl" TEXT,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PayrollComponent" (
    "id" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "PayrollComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_periodeBulan_periodeTahun_key" ON "public"."Payroll"("employeeId", "periodeBulan", "periodeTahun");

-- AddForeignKey
ALTER TABLE "public"."Payroll" ADD CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "karyawan"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PayrollComponent" ADD CONSTRAINT "PayrollComponent_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "public"."Payroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
