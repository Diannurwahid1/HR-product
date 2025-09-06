import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import formidable, { Fields, Files } from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

async function parseForm(
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      uploadDir: path.join(process.cwd(), "public/uploads"),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (name, ext, part) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `${name}-${unique}${ext}`;
      },
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const { fields, files } = await parseForm(req);
    const getField = (key: string) =>
      Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    const getFilePath = (key: string) =>
      files[key]?.[0]?.newFilename
        ? `/uploads/${files[key][0].newFilename}`
        : undefined;
    let id = getField("id") || req.query.id;
    if (Array.isArray(id)) id = id[0];
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID wajib diisi." });
    }
    let updateData: any = {};
    [
      "namaLengkap",
      "email",
      "nomorTelepon",
      "tanggalLahir",
      "jenisKelamin",
      "nomorRekening",
      "alamat",
      "username",
      "status",
      "idDepartment",
    ].forEach((key) => {
      const val = getField(key);
      if (val !== undefined) updateData[key] = val;
    });
    const password = getField("password");
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    ["foto", "ktp", "npwp", "ijazah", "cv"].forEach((key) => {
      const filePath = getFilePath(key);
      if (filePath) updateData[key] = filePath;
    });
    const employee = await prisma.employee.update({
      where: { id: id as string },
      data: updateData,
    });
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan server." });
  }
}
