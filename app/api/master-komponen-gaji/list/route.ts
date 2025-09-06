import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const where: any = {};
    if (status) where.status = status;
    const komponen = await prisma.masterKomponenGaji.findMany({
      where,
      orderBy: { nama: "asc" },
    });
    return NextResponse.json({ success: true, komponen });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
