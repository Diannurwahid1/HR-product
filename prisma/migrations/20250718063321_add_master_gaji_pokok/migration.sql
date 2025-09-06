-- CreateTable
CREATE TABLE "public"."MasterGajiPokok" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "berlakuMulai" TIMESTAMP(3) NOT NULL,
    "berlakuSampai" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "MasterGajiPokok_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MasterGajiPokok" ADD CONSTRAINT "MasterGajiPokok_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "karyawan"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
