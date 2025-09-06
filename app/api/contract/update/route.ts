import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const getField = (key: string) => body[key] || null;
    const id = getField("id");
    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    }
    const updateData: any = {
      employeeId: getField("employeeId"),
      departemen: getField("departemen"),
      posisiJabatan: getField("posisiJabatan"),
      atasanLangsung: getField("atasanLangsung"),
      jenisKontrak: getField("jenisKontrak"),
      tanggalMulai: getField("tanggalMulai")
        ? new Date(getField("tanggalMulai"))
        : undefined,
      tanggalBerakhir: getField("tanggalBerakhir")
        ? new Date(getField("tanggalBerakhir"))
        : undefined,
      durasiKontrak: getField("durasiKontrak"),
      periodeReview: getField("periodeReview"),
      gajiPokok: getField("gajiPokok")
        ? parseInt(getField("gajiPokok"))
        : undefined,
      tunjangan: getField("tunjangan")
        ? parseInt(getField("tunjangan"))
        : undefined,
      uangMakan: getField("uangMakan")
        ? parseInt(getField("uangMakan"))
        : undefined,
      uangTransport: getField("uangTransport")
        ? parseInt(getField("uangTransport"))
        : undefined,
      templateKontrak: getField("templateKontrak"),
      catatan: getField("catatan"),
    };
    const contract = await prisma.contract.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, contract });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
