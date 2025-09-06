import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { roleId, permissionId, allowed } = await req.json();
    if (!roleId || !permissionId || typeof allowed !== "boolean") {
      return NextResponse.json(
        { error: "roleId, permissionId, dan allowed wajib diisi." },
        { status: 400 }
      );
    }
    const updated = await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      update: { allowed },
      create: { roleId, permissionId, allowed },
    });
    return NextResponse.json({ success: true, rolePermission: updated });
  } catch (error) {
    console.error("Error updating role-permission:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
