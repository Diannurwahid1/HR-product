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
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const { fields, files } = await parseForm(req);
    const getField = (key: string) =>
      Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    const getFilePath = (key: string) =>
      files[key]?.[0]?.newFilename
        ? `/uploads/${files[key][0].newFilename}`
        : null;

    const namaLengkap = getField("namaLengkap");
    const email = getField("email");
    const nomorTelepon = getField("nomorTelepon");
    const tanggalLahir = getField("tanggalLahir");
    const jenisKelamin = getField("jenisKelamin");
    const nomorRekening = getField("nomorRekening");
    const alamat = getField("alamat");
    const username = getField("username");
    const password = getField("password");
    const idDepartment = getField("idDepartment");

    if (
      !namaLengkap ||
      !email ||
      !nomorTelepon ||
      !tanggalLahir ||
      !jenisKelamin ||
      !alamat ||
      !username ||
      !password
    ) {
      return res.status(400).json({ error: "Field wajib tidak boleh kosong." });
    }

    if (!idDepartment) {
      return res.status(400).json({ error: "Department wajib dipilih." });
    }
    // Ambil kode department
    const department = await prisma.department.findUnique({
      where: { id: idDepartment },
    });
    if (!department) {
      return res.status(400).json({ error: "Department tidak ditemukan." });
    }
    const kodeDept = department.name.toUpperCase().slice(0, 3);
    // Hitung jumlah karyawan di department tsb
    const count = await prisma.employee.count({ where: { idDepartment } });
    const nik = `${kodeDept}${String(count + 1).padStart(5, "0")}`;

    const existing = await prisma.employee.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Email atau username sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.employee.create({
      data: {
        nik,
        namaLengkap,
        email,
        nomorTelepon,
        tanggalLahir: new Date(tanggalLahir),
        jenisKelamin,
        nomorRekening,
        alamat,
        username,
        password: hashedPassword,
        foto: getFilePath("foto"),
        ktp: getFilePath("ktp"),
        npwp: getFilePath("npwp"),
        ijazah: getFilePath("ijazah"),
        cv: getFilePath("cv"),
        idDepartment,
      },
    });

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan server." });
  }
}
