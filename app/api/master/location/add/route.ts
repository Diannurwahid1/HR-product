import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, address, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Nama lokasi wajib diisi." },
        { status: 400 }
      );
    }
    const location = await prisma.location.create({
      data: { name, address, description },
    });
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("Error adding location:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
