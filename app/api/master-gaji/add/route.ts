import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employeeId,
      nominal,
      berlakuMulai,
      berlakuSampai,
      status,
      keterangan,
    } = body;
    if (!employeeId || !nominal || !berlakuMulai || !status) {
      return NextResponse.json(
        { error: "Field wajib tidak boleh kosong." },
        { status: 400 }
      );
    }
    // Cek duplikasi aktif
    const existing = await prisma.masterGajiPokok.findFirst({
      where: { employeeId, status: "Aktif" },
    });
    if (existing && status === "Aktif") {
      return NextResponse.json(
        { error: "Sudah ada gaji pokok aktif untuk karyawan ini." },
        { status: 409 }
      );
    }
    const gaji = await prisma.masterGajiPokok.create({
      data: {
        employeeId,
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
