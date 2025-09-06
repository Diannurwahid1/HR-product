import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, date, description } = await req.json();
    if (!id || !name || !date) {
      return NextResponse.json(
        { error: "ID, nama, dan tanggal wajib diisi." },
        { status: 400 }
      );
    }
    const holiday = await prisma.holiday.update({
      where: { id },
      data: { name, date, description },
    });
    return NextResponse.json({ success: true, holiday });
  } catch (error) {
    console.error("Error editing holiday:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
