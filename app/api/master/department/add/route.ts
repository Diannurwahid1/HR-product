import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json(
        { error: "Nama department wajib diisi." },
        { status: 400 }
      );
    }
    const department = await prisma.department.create({
      data: { name, description },
    });
    return NextResponse.json({ success: true, department });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error adding department:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
