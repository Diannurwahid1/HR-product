import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nama, tipe, defaultNominal, status, keterangan } = body;
    if (!id || !nama || !tipe || !defaultNominal || !status) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }
    const exist = await prisma.masterKomponenGaji.findFirst({
      where: { nama, NOT: { id } },
    });
    if (exist) {
      return NextResponse.json(
        { error: "Nama komponen sudah ada." },
        { status: 400 }
      );
    }
    const komp = await prisma.masterKomponenGaji.update({
      where: { id },
      data: {
        nama,
        tipe,
        defaultNominal: Number(defaultNominal),
        status,
        keterangan,
      },
    });
    return NextResponse.json({ success: true, komp });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
