import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../../../utils/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    requireRole(req, ["admin", "hr"]);
    const banks = await prisma.bank.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ success: true, banks });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Error fetching banks:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
