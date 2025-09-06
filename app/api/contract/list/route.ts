import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        employee: true,
      },
    });
    // Ambil data jobPosition dan department untuk setiap kontrak
    const jobPositions = await prisma.jobPosition.findMany();
    const departments = await prisma.department.findMany();
    const contractsWithMaster = contracts.map((c) => ({
      ...c,
      jobPosition:
        jobPositions.find((jp) => jp.name === c.posisiJabatan) || null,
      department:
        departments.find(
          (d) => d.id === c.departemen || d.name === c.departemen
        ) || null,
      nomorKontrak: c.nomorKontrak,
    }));
    return Response.json({ success: true, contracts: contractsWithMaster });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
