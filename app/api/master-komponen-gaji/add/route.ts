import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, tipe, defaultNominal, status, keterangan } = body;
    if (!nama || !tipe || !defaultNominal || !status) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }
    const exist = await prisma.masterKomponenGaji.findFirst({
      where: { nama },
    });
    if (exist) {
      return NextResponse.json(
        { error: "Nama komponen sudah ada." },
        { status: 400 }
      );
    }
    const komp = await prisma.masterKomponenGaji.create({
      data: {
        id: crypto.randomUUID(),
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
