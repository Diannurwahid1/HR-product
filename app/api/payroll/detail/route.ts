import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID payroll wajib diisi." },
        { status: 400 }
      );
    }
    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: { employee: true, components: true },
    });
    if (!payroll) {
      return NextResponse.json(
        { error: "Payroll tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, payroll });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
