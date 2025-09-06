import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, address, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "ID dan nama lokasi wajib diisi." },
        { status: 400 }
      );
    }
    const location = await prisma.location.update({
      where: { id },
      data: { name, address, description },
    });
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("Error editing location:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
