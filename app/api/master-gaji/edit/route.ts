import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nominal, berlakuMulai, berlakuSampai, status, keterangan } =
      body;
    if (!id || !nominal || !berlakuMulai || !status) {
      return NextResponse.json(
        { error: "Field wajib tidak boleh kosong." },
        { status: 400 }
      );
    }
    const gaji = await prisma.masterGajiPokok.update({
      where: { id },
      data: {
        nominal: Number(nominal),
        berlakuMulai: new Date(berlakuMulai),
        berlakuSampai: berlakuSampai ? new Date(berlakuSampai) : null,
        status,
        keterangan: keterangan || null,
      },
    });
    return NextResponse.json({ success: true, gaji });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
