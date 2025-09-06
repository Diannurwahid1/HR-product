import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";
const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const { id, name, startTime, endTime, description } = await req.json();
    if (!id || !name || !startTime || !endTime) {
      return NextResponse.json(
        { error: "ID, nama, jam masuk, dan jam keluar wajib diisi." },
        { status: 400 }
      );
    }
    const shift = await prisma.workShift.update({
      where: { id },
      data: { name, startTime, endTime, description },
    });
    return NextResponse.json({ success: true, shift });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error editing shift:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
