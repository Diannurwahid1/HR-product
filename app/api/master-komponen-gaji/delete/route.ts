import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id)
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    const exist = await prisma.masterKomponenGaji.findUnique({ where: { id } });
    if (!exist)
      return NextResponse.json(
        { error: "Data tidak ditemukan." },
        { status: 404 }
      );
    await prisma.masterKomponenGaji.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
