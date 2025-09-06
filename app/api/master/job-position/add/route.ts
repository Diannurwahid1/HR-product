import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Nama jabatan wajib diisi." },
        { status: 400 }
      );
    }
    const jobPosition = await prisma.jobPosition.create({
      data: { name, description },
    });
    return NextResponse.json({ success: true, jobPosition });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama jabatan sudah ada." },
        { status: 409 }
      );
    }
    console.error("Error adding job position:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
