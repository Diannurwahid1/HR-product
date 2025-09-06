import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Nama permission wajib diisi." },
        { status: 400 }
      );
    }
    const permission = await prisma.permission.create({
      data: { name, description },
    });
    return NextResponse.json({ success: true, permission });
  } catch (error) {
    console.error("Error adding permission:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
