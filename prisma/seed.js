// CommonJS version for Node.js seed
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Seed Department
  const departments = [
    { name: "HRD", description: "Human Resource Department" },
    { name: "ENG", description: "Engineering" },
  ];
  const departmentRecords = [];
  for (const dept of departments) {
    const d = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: { id: crypto.randomUUID(), ...dept },
    });
    departmentRecords.push(d);
  }

  // 2. Seed Role
  const roles = [
    { name: "Admin", description: "Administrator sistem" },
    { name: "Manager", description: "Manajer" },
    { name: "HR Staff", description: "Staf HRD" },
    { name: "Karyawan", description: "Karyawan biasa" },
  ];
  const roleRecords = [];
  for (const role of roles) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { id: crypto.randomUUID(), ...role },
    });
    roleRecords.push(r);
  }

  // 3. Seed User (ambil id role Admin)
  const adminRole = roleRecords.find((r) => r.name === "Admin");
  const adminRoleId = adminRole?.id;
  await prisma.user.upsert({
    where: { email: "admin@exp.com" },
    update: {
      name: "Admin User",
      password: hashedPassword,
      roleId: adminRoleId,
    },
    create: {
      id: crypto.randomUUID(),
      email: "admin@exp.com",
      name: "Admin User",
      password: hashedPassword,
      roleId: adminRoleId,
    },
  });

  // 4. Seed Employee (gunakan department HRD)
  const hrdDept = departmentRecords.find((d) => d.name === "HRD");
  const engDept = departmentRecords.find((d) => d.name === "ENG");
  await prisma.employee.upsert({
    where: { email: "budi@exp.com" },
    update: {
      namaLengkap: "Budi Santoso",
      nomorTelepon: "08123456789",
      tanggalLahir: new Date("1990-01-01"),
      jenisKelamin: "Laki-laki",
      nomorRekening: "1234567890",
      alamat: "Jl. Contoh No. 1",
      username: "budi",
      password: hashedPassword,
      foto: null,
      ktp: null,
      npwp: null,
      ijazah: null,
      cv: null,
      status: "Aktif",
      nik: `HRD00001`,
      idDepartment: hrdDept.id,
    },
    create: {
      id: crypto.randomUUID(),
      namaLengkap: "Budi Santoso",
      email: "budi@exp.com",
      nomorTelepon: "08123456789",
      tanggalLahir: new Date("1990-01-01"),
      jenisKelamin: "Laki-laki",
      nomorRekening: "1234567890",
      alamat: "Jl. Contoh No. 1",
      username: "budi",
      password: hashedPassword,
      foto: null,
      ktp: null,
      npwp: null,
      ijazah: null,
      cv: null,
      status: "Aktif",
      createdAt: new Date(),
      updatedAt: new Date(),
      nik: `HRD00001`,
      idDepartment: hrdDept.id,
    },
  });

  // Ambil semua employee untuk relasi contract
  const employees = await prisma.employee.findMany();
  if (employees.length > 0) {
    // Helper generate nomor kontrak
    function generateNomorKontrak(dept, date, seq) {
      const pad = (n) => n.toString().padStart(4, "0");
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      return `CTR/${dept}/${y}${m}/${pad(seq)}`;
    }
    let seq = 1;
    for (let i = 0; i < 5; i++) {
      const employee = employees[i % employees.length];
      const dept = ["ENG", "HRD", "MKT", "FIN", "OPS"][i];
      const tglMulai = new Date(`2024-0${(i % 5) + 1}-01`);
      const nomorKontrak = generateNomorKontrak(dept, tglMulai, seq++);
      await prisma.contract.create({
        data: {
          id: crypto.randomUUID(),
          nomorKontrak,
          employeeId: employee.id,
          departemen: dept,
          posisiJabatan: [
            "Software Engineer",
            "HR Manager",
            "Digital Marketer",
            "Finance Analyst",
            "Operation Staff",
          ][i],
          atasanLangsung: [
            "Budi Santoso",
            "Dewi Lestari",
            "Rudi Hermawan",
            "Siti Nurhaliza",
            "Ahmad Fauzi",
          ][i],
          jenisKontrak: i % 2 === 0 ? "PKWT" : "PKWTT",
          tanggalMulai: tglMulai,
          tanggalBerakhir: new Date(`2024-0${(i % 5) + 7}-01`),
          durasiKontrak: i % 2 === 0 ? "6 bulan" : "12 bulan",
          periodeReview: i % 2 === 0 ? "3 bulan" : "6 bulan",
          gajiPokok: 5000000 + i * 1000000,
          tunjangan: 1000000 + i * 500000,
          uangMakan: 700000 + i * 100000,
          uangTransport: 300000 + i * 100000,
          templateKontrak: [
            "Template PKWT Standard",
            "Template PKWTT Standard",
            "Template Internship",
            "Template Manager",
            "Template PKWT Standard",
          ][i],
          dokumenKontrak: null,
          catatan: `Dummy kontrak ke-${i + 1}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    console.log(
      "✅ 5 Contract dummy dengan relasi employee & nomor kontrak berhasil di-seed."
    );
  } else {
    console.log("⚠️  Tidak ada employee untuk relasi contract.");
  }

  // Seed Permission (fungsi sistem)
  const permissions = [
    { name: "Dashboard", description: "Akses dashboard utama" },
    { name: "Manajemen Karyawan", description: "Kelola data karyawan" },
    { name: "Kontrak Kerja - Lihat", description: "Lihat kontrak kerja" },
    { name: "Kontrak Kerja - Edit", description: "Edit kontrak kerja" },
    { name: "Penilaian KPI - Lihat", description: "Lihat penilaian KPI" },
    { name: "Penilaian KPI - Edit", description: "Edit penilaian KPI" },
    { name: "Pengaturan Sistem", description: "Akses pengaturan sistem" },
  ];
  const permissionRecords = [];
  for (const perm of permissions) {
    const p = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: { id: crypto.randomUUID(), ...perm },
    });
    permissionRecords.push(p);
  }

  // Seed RolePermission (default: Admin semua true, lain sesuai kebutuhan)
  for (const role of roleRecords) {
    for (const perm of permissionRecords) {
      let allowed = false;
      if (role.name === "Admin") allowed = true;
      if (
        role.name === "Manager" &&
        [
          "Dashboard",
          "Manajemen Karyawan",
          "Kontrak Kerja - Lihat",
          "Kontrak Kerja - Edit",
          "Penilaian KPI - Lihat",
          "Penilaian KPI - Edit",
        ].includes(perm.name)
      )
        allowed = true;
      if (
        role.name === "HR Staff" &&
        [
          "Dashboard",
          "Manajemen Karyawan",
          "Kontrak Kerja - Lihat",
          "Penilaian KPI - Lihat",
        ].includes(perm.name)
      )
        allowed = true;
      if (
        role.name === "Karyawan" &&
        [
          "Dashboard",
          "Kontrak Kerja - Lihat",
          "Penilaian KPI - Lihat",
        ].includes(perm.name)
      )
        allowed = true;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
        update: { allowed },
        create: {
          id: crypto.randomUUID(),
          roleId: role.id,
          permissionId: perm.id,
          allowed,
        },
      });
    }
  }
  console.log("✅ Role, Permission, dan RolePermission seeded successfully.");

  // Seed Bank
  console.log("Seeding Bank...");
  const banks = [
    { name: "Bank Central Asia", code: "BCA", logo: null },
    { name: "Bank Mandiri", code: "MANDIRI", logo: null },
    { name: "Bank Negara Indonesia", code: "BNI", logo: null },
    { name: "Bank Rakyat Indonesia", code: "BRI", logo: null },
    { name: "Bank Syariah Indonesia", code: "BSI", logo: null },
  ];
  let bankCount = 0;
  for (const bank of banks) {
    await prisma.bank.upsert({
      where: { code: bank.code },
      update: {},
      create: { id: crypto.randomUUID(), ...bank },
    });
    bankCount++;
  }
  console.log(`✅ Bank seeded: ${bankCount}`);

  // Seed WorkShift
  console.log("Seeding WorkShift...");
  const shifts = [
    {
      name: "Shift Pagi",
      startTime: "08:00",
      endTime: "16:00",
      description: "Jam kerja pagi",
    },
    {
      name: "Shift Siang",
      startTime: "14:00",
      endTime: "22:00",
      description: "Jam kerja siang",
    },
    {
      name: "Shift Malam",
      startTime: "22:00",
      endTime: "06:00",
      description: "Jam kerja malam",
    },
  ];
  let shiftCount = 0;
  for (const shift of shifts) {
    await prisma.workShift.upsert({
      where: { name: shift.name },
      update: {},
      create: { id: crypto.randomUUID(), ...shift },
    });
    shiftCount++;
  }
  console.log(`✅ WorkShift seeded: ${shiftCount}`);

  // Seed Location
  console.log("Seeding Location...");
  const locations = [
    {
      name: "Kantor Pusat",
      address: "Jl. Sudirman No. 1, Jakarta",
      description: "Kantor pusat",
    },
    {
      name: "Kantor Cabang Bandung",
      address: "Jl. Asia Afrika No. 10, Bandung",
      description: "Cabang Bandung",
    },
    {
      name: "Kantor Cabang Surabaya",
      address: "Jl. Basuki Rahmat No. 20, Surabaya",
      description: "Cabang Surabaya",
    },
  ];
  let locCount = 0;
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { name: loc.name },
      update: {},
      create: { id: crypto.randomUUID(), ...loc },
    });
    locCount++;
  }
  console.log(`✅ Location seeded: ${locCount}`);

  // Seed Holiday
  console.log("Seeding Holiday...");
  const holidays = [
    {
      name: "Tahun Baru",
      date: new Date("2024-01-01"),
      description: "Libur Tahun Baru",
    },
    {
      name: "Hari Raya Idul Fitri",
      date: new Date("2024-04-10"),
      description: "Libur Lebaran",
    },
    {
      name: "Hari Kemerdekaan",
      date: new Date("2024-08-17"),
      description: "HUT RI",
    },
  ];
  let holCount = 0;
  for (const hol of holidays) {
    await prisma.holiday.upsert({
      where: { name: hol.name },
      update: {},
      create: { id: crypto.randomUUID(), ...hol },
    });
    holCount++;
  }
  console.log(`✅ Holiday seeded: ${holCount}`);
  console.log("✅ Semua master data berhasil di-seed.");

  // Seed MasterGajiPokok untuk setiap employee
  const now = new Date();
  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    await prisma.masterGajiPokok.upsert({
      where: { id: emp.id + "-gaji" },
      update: {},
      create: {
        id: emp.id + "-gaji",
        employeeId: emp.id,
        nominal: 5000000 + i * 500000,
        berlakuMulai: now,
        status: "Aktif",
        keterangan: "Seed awal",
      },
    });
  }
  console.log("✅ MasterGajiPokok seeded untuk semua employee.");

  // Seed MasterKomponenGaji
  const komponenGaji = [
    {
      nama: "Tunjangan Transport",
      tipe: "tunjangan",
      defaultNominal: 500000,
      status: "Aktif",
      keterangan: "Transport bulanan",
    },
    {
      nama: "Tunjangan Makan",
      tipe: "tunjangan",
      defaultNominal: 400000,
      status: "Aktif",
      keterangan: "Makan bulanan",
    },
    {
      nama: "Tunjangan Kesehatan",
      tipe: "tunjangan",
      defaultNominal: 300000,
      status: "Aktif",
      keterangan: "BPJS Kesehatan",
    },
    {
      nama: "Potongan BPJS",
      tipe: "potongan",
      defaultNominal: 150000,
      status: "Aktif",
      keterangan: "BPJS Ketenagakerjaan",
    },
    {
      nama: "Potongan Pajak",
      tipe: "potongan",
      defaultNominal: 200000,
      status: "Aktif",
      keterangan: "PPh 21",
    },
  ];
  for (const komp of komponenGaji) {
    const id = komp.nama.toLowerCase().replace(/\s+/g, "-") + "-komp";
    await prisma.masterKomponenGaji.upsert({
      where: { id },
      update: {},
      create: { id, ...komp },
    });
  }
  console.log("✅ MasterKomponenGaji seeded.");

  // Seed JobPosition (master jabatan)
  const jobPositions = [
    { name: "Software Engineer", description: "Pengembang perangkat lunak" },
    { name: "HR Manager", description: "Manajer HRD" },
    { name: "Digital Marketer", description: "Pemasaran digital" },
    { name: "Finance Analyst", description: "Analis keuangan" },
    { name: "Operation Staff", description: "Staf operasional" },
    { name: "Admin", description: "Administrator" },
    { name: "Intern", description: "Magang" },
    { name: "QA Engineer", description: "Quality Assurance" },
    { name: "Product Manager", description: "Manajer Produk" },
    { name: "Customer Support", description: "Dukungan Pelanggan" },
  ];
  for (const pos of jobPositions) {
    await prisma.jobPosition.upsert({
      where: { name: pos.name },
      update: {},
      create: { id: crypto.randomUUID(), ...pos },
    });
  }
  console.log("✅ JobPosition (master jabatan) seeded.");

  console.log("✅ User & Employee seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
