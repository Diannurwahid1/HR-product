import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const { name, code, logo } = await req.json();
    if (!name || !code) {
      return NextResponse.json(
        { error: "Nama dan kode bank wajib diisi." },
        { status: 400 }
      );
    }
    const bank = await prisma.bank.create({ data: { name, code, logo } });
    return NextResponse.json({ success: true, bank });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error adding bank:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
