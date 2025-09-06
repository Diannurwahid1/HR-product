import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";
const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const { id, name, code, logo } = await req.json();
    if (!id || !name || !code) {
      return NextResponse.json(
        { error: "ID, nama, dan kode bank wajib diisi." },
        { status: 400 }
      );
    }
    const bank = await prisma.bank.update({
      where: { id },
      data: { name, code, logo },
    });
    return NextResponse.json({ success: true, bank });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error editing bank:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
