import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "ID dan nama permission wajib diisi." },
        { status: 400 }
      );
    }
    // Cek duplikat nama (kecuali untuk id yang sama)
    const existing = await prisma.permission.findFirst({
      where: { name, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Nama permission sudah digunakan." },
        { status: 409 }
      );
    }
    const updated = await prisma.permission.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json({ success: true, permission: updated });
  } catch (error) {
    console.error("Error editing permission:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
