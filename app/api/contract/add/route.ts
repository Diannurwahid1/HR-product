import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const getField = (key: string) => body[key] || null;

    const employeeId = getField("employeeId");
    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId wajib diisi." },
        { status: 400 }
      );
    }

    // Ambil nama departemen dari master
    let deptName = getField("departemen") || "GEN";
    if (deptName && deptName.length > 10) {
      // kemungkinan id
      const deptObj = await prisma.department.findUnique({
        where: { id: deptName },
      });
      if (deptObj) deptName = deptObj.name;
    }
    // Generate nomor kontrak otomatis
    const tglMulai = getField("tanggalMulai")
      ? new Date(getField("tanggalMulai"))
      : new Date();
    const y = tglMulai.getFullYear();
    const m = (tglMulai.getMonth() + 1).toString().padStart(2, "0");
    const startMonth = new Date(y, tglMulai.getMonth(), 1);
    const nextMonth = new Date(y, tglMulai.getMonth(), 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const count = await prisma.contract.count({
      where: {
        departemen: deptName,
        tanggalMulai: {
          gte: startMonth,
          lt: nextMonth,
        },
      },
    });
    const seq = (count + 1).toString().padStart(4, "0");
    const nomorKontrak = `CTR/${deptName}/${y}${m}/${seq}`;

    const contract = await prisma.contract.create({
      data: {
        nomorKontrak,
        employeeId,
        departemen: deptName,
        posisiJabatan: getField("posisiJabatan"),
        atasanLangsung: getField("atasanLangsung"),
        jenisKontrak: getField("jenisKontrak"),
        tanggalMulai: new Date(getField("tanggalMulai")),
        tanggalBerakhir: new Date(getField("tanggalBerakhir")),
        durasiKontrak: getField("durasiKontrak"),
        periodeReview: getField("periodeReview"),
        gajiPokok: parseInt(getField("gajiPokok") || "0"),
        tunjangan: getField("tunjangan")
          ? parseInt(getField("tunjangan"))
          : null,
        uangMakan: parseInt(getField("uangMakan") || "0"),
        uangTransport: getField("uangTransport")
          ? parseInt(getField("uangTransport"))
          : null,
        templateKontrak: getField("templateKontrak"),
        dokumenKontrak: null, // tidak support upload file
        catatan: getField("catatan"),
      } as any,
    });
    return NextResponse.json({ success: true, contract });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
