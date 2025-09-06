import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function getUserRoleFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload.role || null;
  } catch {
    return null;
  }
}

export function requireRole(
  req: NextRequest,
  allowedRoles: string[]
): string | null {
  const role = getUserRoleFromRequest(req);
  if (!role || !allowedRoles.includes(role.toLowerCase())) {
    throw new Error("FORBIDDEN");
  }
  return role;
}
