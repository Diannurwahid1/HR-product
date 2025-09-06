import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const jobPositions = await prisma.jobPosition.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, jobPositions });
  } catch (error) {
    console.error("Error fetching job positions:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
