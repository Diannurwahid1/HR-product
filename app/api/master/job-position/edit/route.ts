import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "ID dan nama jabatan wajib diisi." },
        { status: 400 }
      );
    }
    const jobPosition = await prisma.jobPosition.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json({ success: true, jobPosition });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama jabatan sudah ada." },
        { status: 409 }
      );
    }
    console.error("Error editing job position:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
