import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, periodeBulan, periodeTahun, components } = body;
    if (
      !employeeId ||
      !periodeBulan ||
      !periodeTahun ||
      !Array.isArray(components) ||
      components.length === 0
    ) {
      return NextResponse.json(
        { error: "Data tidak lengkap atau komponen kosong." },
        { status: 400 }
      );
    }
    // Validasi komponen
    for (const c of components) {
      if (!c.nama || !c.tipe || c.nominal === undefined || c.nominal === "") {
        return NextResponse.json(
          { error: "Semua field komponen wajib diisi." },
          { status: 400 }
        );
      }
      if (isNaN(Number(c.nominal)) || Number(c.nominal) <= 0) {
        return NextResponse.json(
          { error: `Nominal komponen '${c.nama}' harus lebih dari 0.` },
          { status: 400 }
        );
      }
      if (!["gaji_pokok", "tunjangan", "potongan"].includes(c.tipe)) {
        return NextResponse.json(
          { error: `Tipe komponen '${c.nama}' tidak valid.` },
          { status: 400 }
        );
      }
    }
    // Cek payroll sudah ada
    const existing = await prisma.payroll.findUnique({
      where: {
        employeeId_periodeBulan_periodeTahun: {
          employeeId,
          periodeBulan,
          periodeTahun,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Payroll untuk karyawan dan periode ini sudah ada.` },
        { status: 409 }
      );
    }
    // Hitung total
    let totalGaji = 0;
    for (const c of components) {
      if (c.tipe === "potongan") totalGaji -= Math.abs(Number(c.nominal));
      else totalGaji += Math.abs(Number(c.nominal));
    }
    // Simpan payroll
    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        periodeBulan,
        periodeTahun,
        totalGaji,
        status: "Draft",
        components: {
          create: components.map((c: any) => ({
            nama: c.nama,
            tipe: c.tipe,
            nominal: Number(c.nominal),
            keterangan: c.keterangan || null,
          })),
        },
      },
      include: { components: true },
    });
    return NextResponse.json({ success: true, payroll });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
