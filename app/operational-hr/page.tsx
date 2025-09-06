import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  UserPlus,
  Settings as SettingsIcon,
  Users,
  Plus,
} from "lucide-react";
import AbsensiTab from "./AbsensiTab";
import IzinCutiTab, { IzinCutiRow } from "./IzinCutiTab";
import LemburTab, { LemburRow } from "./LemburTab";
import JadwalTab, { JadwalRow } from "./JadwalTab";

const TABS = [
  { key: "absensi", label: "Absensi" },
  { key: "izin", label: "Izin & Cuti" },
  { key: "lembur", label: "Lembur" },
  { key: "jadwal", label: "Jadwal Karyawan" },
];

const dummyStats = {
  totalKehadiran: 87,
  totalKaryawan: 104,
  tepatWaktu: 82,
  terlambat: 5,
};

const dummyWeeklyStats = {
  rataRataTepatWaktu: 92,
  ketidakhadiran: 4.5,
  wfh: 12,
};

const dummyBelumCheckin = [
  { nama: "Tono Sucipto" },
  { nama: "Siti Rahayu" },
  { nama: "Joko Widodo" },
];

const dummyKehadiran = [
  { nama: "Ahmad Faisal", dept: "IT", jam: "08:02", status: "Tepat Waktu" },
  { nama: "Dewi Sartika", dept: "Keuangan", jam: "08:30", status: "Terlambat" },
  {
    nama: "Budi Santoso",
    dept: "Marketing",
    jam: "07:50",
    status: "Tepat Waktu",
  },
  { nama: "Sri Wahyuni", dept: "HR", jam: "08:05", status: "Tepat Waktu" },
  {
    nama: "Rudi Hermawan",
    dept: "Produksi",
    jam: "08:45",
    status: "Terlambat",
  },
  {
    nama: "Nina Agustina",
    dept: "Pengembangan",
    jam: "07:55",
    status: "Tepat Waktu",
  },
];

const dummyIzinCuti: IzinCutiRow[] = [
  {
    nama: "Ahmad Faisal",
    dept: "IT",
    jenis: "Cuti Tahunan",
    alasan: "Keperluan keluarga",
    durasi: "3 hari",
    tanggalMulai: "15/01/2024",
    tanggalSelesai: "17/01/2024",
    status: "Disetujui",
  },
  {
    nama: "Dewi Sartika",
    dept: "Keuangan",
    jenis: "Izin Sakit",
    alasan: "Demam tinggi",
    durasi: "2 hari",
    tanggalMulai: "12/01/2024",
    tanggalSelesai: "13/01/2024",
    status: "Menunggu",
  },
];

const dummyLembur: LemburRow[] = [
  {
    nama: "Budi Santoso",
    tanggal: "2024-07-01",
    jamMulai: "18:00",
    jamSelesai: "20:00",
    keterangan: "Lembur proyek A",
    status: "Disetujui",
  },
  {
    nama: "Sri Wahyuni",
    tanggal: "2024-07-02",
    jamMulai: "17:30",
    jamSelesai: "19:00",
    keterangan: "Lembur laporan",
    status: "Menunggu",
  },
];

const dummyJadwal: JadwalRow[] = [
  {
    nama: "Ahmad Faisal",
    dept: "IT",
    hari: "Senin",
    jamMasuk: "08:00",
    jamPulang: "17:00",
  },
  {
    nama: "Dewi Sartika",
    dept: "Keuangan",
    hari: "Senin",
    jamMasuk: "08:00",
    jamPulang: "17:00",
  },
  {
    nama: "Budi Santoso",
    dept: "Marketing",
    hari: "Senin",
    jamMasuk: "08:00",
    jamPulang: "17:00",
  },
];

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}

const OperationalHRPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("absensi");
  const [izinCuti, setIzinCuti] = useState<IzinCutiRow[]>(dummyIzinCuti);
  const [lembur, setLembur] = useState<LemburRow[]>(dummyLembur);

  // Dummy chart data (replace with chart lib later)
  const chartData = [80, 75, 78, 82, 77];
  const chartLabels = ["Sen", "Sel", "Rab", "Kam", "Jum"];

  // Sidebar khusus untuk tab Izin & Cuti
  const IzinSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 flex flex-col gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Ajukan Izin/Cuti
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Pengaturan Izin & Cuti
        </button>
      </div>
      {/* Pengajuan Cepat */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Pengajuan Cepat</div>
        <select className="w-full mb-2 border rounded-lg px-3 py-2">
          <option>Pilih jenis pengajuan</option>
          <option>Izin</option>
          <option>Cuti</option>
        </select>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            className="w-1/2 border rounded-lg px-3 py-2"
            placeholder="Tanggal Mulai"
          />
          <input
            type="date"
            className="w-1/2 border rounded-lg px-3 py-2"
            placeholder="Tanggal Selesai"
          />
        </div>
        <input
          className="w-full mb-2 border rounded-lg px-3 py-2"
          placeholder="Alasan"
        />
        <button className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700">
          Ajukan
        </button>
      </div>
      {/* Perlu Persetujuan Anda */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Perlu Persetujuan Anda</div>
        <ul className="mb-2">
          <li className="flex items-center gap-2 py-1">
            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-bold">
              BS
            </span>
            <span>Budi Santoso</span>
            <span className="text-xs text-gray-400">Cuti Khusus</span>
            <span className="ml-auto text-xs text-gray-400">2 hari</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-bold">
              SW
            </span>
            <span>Sri Wahyuni</span>
            <span className="text-xs text-gray-400">Cuti Tahunan</span>
            <span className="ml-auto text-xs text-gray-400">3 hari</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-bold">
              JW
            </span>
            <span>Joko Widodo</span>
            <span className="text-xs text-gray-400">Izin Pribadi</span>
            <span className="ml-auto text-xs text-gray-400">1 hari</span>
          </li>
        </ul>
        <button className="text-xs text-blue-600 hover:underline">
          Lihat semua (5)
        </button>
      </div>
      {/* Sisa Jatah Cuti Tahunan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Sisa Jatah Cuti Tahunan</div>
        <div className="text-xs text-gray-500 mb-2">Rata-rata per karyawan</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>IT</span>
            <span>12 hari</span>
          </div>
          <div className="flex justify-between">
            <span>Keuangan</span>
            <span>10 hari</span>
          </div>
          <div className="flex justify-between">
            <span>Marketing</span>
            <span>14 hari</span>
          </div>
          <div className="flex justify-between">
            <span>HR</span>
            <span>9 hari</span>
          </div>
          <div className="flex justify-between">
            <span>Produksi</span>
            <span>15 hari</span>
          </div>
          <div className="flex justify-between">
            <span>Pengembangan</span>
            <span>8 hari</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar default (Absensi/dll)
  const DefaultSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 flex flex-col gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <UserPlus className="w-4 h-4" />
          Rekam Kehadiran Manual
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Pengaturan Absensi
        </button>
      </div>
      {/* Statistik Mingguan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Statistik Mingguan</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>Rata-rata ketepatan waktu</span>
            <span>92%</span>
          </div>
          <div className="flex justify-between">
            <span>Ketidakhadiran</span>
            <span>4.5%</span>
          </div>
          <div className="flex justify-between">
            <span>Karyawan WFH</span>
            <span>12</span>
          </div>
        </div>
      </div>
      {/* Belum Check-in Hari Ini */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Belum Check-in Hari Ini</div>
        <ul className="mb-2">
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/men/31.jpg"
              alt="Tono Sucipto"
              className="w-6 h-6 rounded-full"
            />
            <span>Tono Sucipto</span>
            <span className="ml-auto text-xs text-gray-400">Belum absen</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/women/41.jpg"
              alt="Siti Rahayu"
              className="w-6 h-6 rounded-full"
            />
            <span>Siti Rahayu</span>
            <span className="ml-auto text-xs text-gray-400">Belum absen</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="Joko Widodo"
              className="w-6 h-6 rounded-full"
            />
            <span>Joko Widodo</span>
            <span className="ml-auto text-xs text-gray-400">Belum absen</span>
          </li>
        </ul>
        <button className="text-xs text-blue-600 hover:underline">
          Lihat semua (12)
        </button>
      </div>
    </div>
  );

  const AbsensiSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 flex flex-col gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <UserPlus className="w-4 h-4" />
          Rekam Kehadiran Manual
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Pengaturan Absensi
        </button>
      </div>
      {/* Statistik Mingguan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Statistik Mingguan</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>Rata-rata ketepatan waktu</span>
            <span>92%</span>
          </div>
          <div className="flex justify-between">
            <span>Ketidakhadiran</span>
            <span>4.5%</span>
          </div>
          <div className="flex justify-between">
            <span>Karyawan WFH</span>
            <span>12</span>
          </div>
        </div>
      </div>
      {/* Belum Check-in Hari Ini */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Belum Check-in Hari Ini</div>
        <ul className="mb-2">
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/men/31.jpg"
              alt="Tono Sucipto"
              className="w-6 h-6 rounded-full"
            />
            <span>Tono Sucipto</span>
            <span className="ml-auto text-xs text-gray-400">Belum absen</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/women/41.jpg"
              alt="Siti Rahayu"
              className="w-6 h-6 rounded-full"
            />
            <span>Siti Rahayu</span>
            <span className="ml-auto text-xs text-gray-400">Belum absen</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="Joko Widodo"
              className="w-6 h-6 rounded-full"
            />
            <span>Joko Widodo</span>
            <span className="ml-auto text-xs text-gray-400">Belum absen</span>
          </li>
        </ul>
        <button className="text-xs text-blue-600 hover:underline">
          Lihat semua (12)
        </button>
      </div>
    </div>
  );

  const JadwalSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Kelola Jadwal */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 flex flex-col gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Jadwal
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <FileText className="w-4 h-4" />
          Template Jadwal
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Atur Shift
        </button>
      </div>
      {/* Status Departemen */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Status Departemen</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between items-center mb-1">
            <span>IT</span>
            <span className="text-xs text-gray-500">92%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "92%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>Keuangan</span>
            <span className="text-xs text-gray-500">89%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "89%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>Marketing</span>
            <span className="text-xs text-gray-500">90%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "90%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>HR</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>Produksi</span>
            <span className="text-xs text-gray-500">84%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "84%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span>Pengembangan</span>
            <span className="text-xs text-gray-500">90%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "90%" }}
            ></div>
          </div>
        </div>
      </div>
      {/* Notifikasi Jadwal */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Notifikasi Jadwal</div>
        <ul className="mb-2 text-xs text-gray-700 dark:text-dark-200">
          <li className="mb-1">
            Ahmad Faisal bertukar shift dengan Rizki Pratama{" "}
            <span className="text-gray-400">2 jam yang lalu</span>
          </li>
          <li className="mb-1">
            Jadwal shift Malam ditambahkan untuk departemen Produksi{" "}
            <span className="text-gray-400">4 jam yang lalu</span>
          </li>
          <li>
            Anita Wijaya mengajukan perubahan jadwal{" "}
            <span className="text-gray-400">Kemarin, 15:30</span>
          </li>
        </ul>
      </div>
      {/* Statistik Kehadiran */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Statistik Kehadiran</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <span>Tepat Waktu</span>
            <span>85%</span>
          </div>
          <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden mb-1">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: "85%" }}
            ></div>
          </div>
          <div className="flex justify-between">
            <span>Terlambat</span>
            <span>10%</span>
          </div>
          <div className="w-full h-2 bg-yellow-200 rounded-full overflow-hidden mb-1">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: "10%" }}
            ></div>
          </div>
          <div className="flex justify-between">
            <span>Tidak Hadir</span>
            <span>5%</span>
          </div>
          <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: "5%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const LemburSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 flex flex-col gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Ajukan Lembur
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
          <SettingsIcon className="w-4 h-4" />
          Pengaturan Lembur
        </button>
      </div>
      {/* Pengajuan Cepat */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Pengajuan Cepat</div>
        <select className="w-full mb-2 border rounded-lg px-3 py-2">
          <option>Pilih jenis pengajuan</option>
          <option>Regular</option>
          <option>Proyek Khusus</option>
        </select>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            className="w-1/2 border rounded-lg px-3 py-2"
            placeholder="Tanggal Mulai"
          />
          <input
            type="date"
            className="w-1/2 border rounded-lg px-3 py-2"
            placeholder="Tanggal Selesai"
          />
        </div>
        <input
          className="w-full mb-2 border rounded-lg px-3 py-2"
          placeholder="Alasan"
        />
        <button className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700">
          Ajukan
        </button>
      </div>
      {/* Perlu Persetujuan Anda */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">Perlu Persetujuan Anda</div>
        <ul className="mb-2">
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Budi Santoso"
              className="w-6 h-6 rounded-full"
            />
            <span>Budi Santoso</span>
            <span className="text-xs text-gray-400">Lembur Proyek</span>
            <span className="ml-auto text-xs text-gray-400">2 jam</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Sri Wahyuni"
              className="w-6 h-6 rounded-full"
            />
            <span>Sri Wahyuni</span>
            <span className="text-xs text-gray-400">Lembur Regular</span>
            <span className="ml-auto text-xs text-gray-400">3 jam</span>
          </li>
          <li className="flex items-center gap-2 py-1">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="Joko Widodo"
              className="w-6 h-6 rounded-full"
            />
            <span>Joko Widodo</span>
            <span className="text-xs text-gray-400">Lembur Khusus</span>
            <span className="ml-auto text-xs text-gray-400">1 jam</span>
          </li>
        </ul>
        <button className="text-xs text-blue-600 hover:underline">
          Lihat semua (5)
        </button>
      </div>
      {/* Statistik Lembur per Departemen */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-2">
          Statistik Lembur per Departemen
        </div>
        <div className="text-xs text-gray-500 mb-2">Rata-rata per karyawan</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between items-center">
            <span>IT</span>
            <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
            <span>12 jam</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Keuangan</span>
            <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "67%" }}
              ></div>
            </div>
            <span>10 jam</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Marketing</span>
            <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "93%" }}
              ></div>
            </div>
            <span>14 jam</span>
          </div>
          <div className="flex justify-between items-center">
            <span>HR</span>
            <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "53%" }}
              ></div>
            </div>
            <span>9 jam</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Produksi</span>
            <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <span>15 jam</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
            Operational HR
          </h1>
          <p className="text-gray-600 dark:text-dark-400 text-sm">
            Mengelola aktivitas administratif harian karyawan
          </p>
        </div>
      </header>
      {/* Tabs */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 pt-4">
        <div className="flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors duration-200 ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-dark-400 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Main Grid */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Konten Kiri */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {activeTab === "absensi" && (
              <AbsensiTab
                stats={dummyStats}
                chartData={chartData}
                chartLabels={chartLabels}
                kehadiran={dummyKehadiran}
              />
            )}
            {activeTab === "izin" && <IzinCutiTab />}
            {activeTab === "lembur" && (
              <LemburTab
                data={lembur}
                onSubmit={(row) => setLembur([row, ...lembur])}
              />
            )}
            {activeTab === "jadwal" && <JadwalTab data={dummyJadwal} />}
          </div>
          {/* Sidebar Kanan dinamis */}
          {activeTab === "izin" ? (
            <IzinSidebar />
          ) : activeTab === "jadwal" ? (
            <JadwalSidebar />
          ) : activeTab === "absensi" ? (
            <AbsensiSidebar />
          ) : activeTab === "lembur" ? (
            <LemburSidebar />
          ) : (
            <DefaultSidebar />
          )}
        </div>
      </main>
    </div>
  );
};

export default OperationalHRPage;
