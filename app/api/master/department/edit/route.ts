import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";
const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const { id, name, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json(
        { error: "ID dan nama department wajib diisi." },
        { status: 400 }
      );
    }
    const department = await prisma.department.update({
      where: { id },
      data: { name, description },
    });
    return NextResponse.json({ success: true, department });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error editing department:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
