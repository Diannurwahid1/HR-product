import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Nama peran wajib diisi." },
        { status: 400 }
      );
    }
    const role = await prisma.role.create({
      data: { name, description },
    });
    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error adding role:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
