import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!contract) {
      return NextResponse.json(
        { error: "Kontrak tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, contract });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
