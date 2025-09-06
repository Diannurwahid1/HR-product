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
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!employee) {
      return NextResponse.json(
        { error: "Karyawan tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, employee });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
