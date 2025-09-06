import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const shifts = await prisma.workShift.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, shifts });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error fetching shifts:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
