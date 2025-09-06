import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId") || undefined;
    const periodeBulan = searchParams.get("periodeBulan")
      ? Number(searchParams.get("periodeBulan"))
      : undefined;
    const periodeTahun = searchParams.get("periodeTahun")
      ? Number(searchParams.get("periodeTahun"))
      : undefined;
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (periodeBulan) where.periodeBulan = periodeBulan;
    if (periodeTahun) where.periodeTahun = periodeTahun;
    const payrolls = await prisma.payroll.findMany({
      where,
      include: { employee: true, components: true },
      orderBy: { tanggalProses: "desc" },
    });
    return NextResponse.json({ success: true, payrolls });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
