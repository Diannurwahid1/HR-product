import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, date, description } = await req.json();
    if (!name || !date) {
      return NextResponse.json(
        { error: "Nama dan tanggal wajib diisi." },
        { status: 400 }
      );
    }
    const holiday = await prisma.holiday.create({
      data: { name, date, description },
    });
    return NextResponse.json({ success: true, holiday });
  } catch (error) {
    console.error("Error adding holiday:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
