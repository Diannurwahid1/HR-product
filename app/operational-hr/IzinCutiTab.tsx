import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Filter, Download, Plus, Settings as SettingsIcon } from "lucide-react";

export interface IzinCutiRow {
  nama: string;
  dept: string;
  jenis: string;
  alasan: string;
  durasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
}

const dummyStat = {
  aktif: 12,
  aktifBreakdown: "4 izin, 8 cuti",
  menunggu: 5,
  riwayat: 24,
  riwayatDisetujui: 20,
  riwayatDitolak: 4,
};

const dummyChart = [
  { minggu: "Minggu 1", Izin: 4, Cuti: 6 },
  { minggu: "Minggu 2", Izin: 2, Cuti: 3 },
  { minggu: "Minggu 3", Izin: 5, Cuti: 8 },
  { minggu: "Minggu 4", Izin: 3, Cuti: 4 },
];

const dummyRows: IzinCutiRow[] = [
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
    status: "Disetujui",
  },
  {
    nama: "Budi Santoso",
    dept: "Marketing",
    jenis: "Cuti Khusus",
    alasan: "Acara pernikahan",
    durasi: "2 hari",
    tanggalMulai: "20/01/2024",
    tanggalSelesai: "21/01/2024",
    status: "Menunggu",
  },
  {
    nama: "Sri Wahyuni",
    dept: "HR",
    jenis: "Cuti Tahunan",
    alasan: "Liburan keluarga",
    durasi: "3 hari",
    tanggalMulai: "25/01/2024",
    tanggalSelesai: "27/01/2024",
    status: "Menunggu",
  },
  {
    nama: "Rudi Hermawan",
    dept: "Produksi",
    jenis: "Izin Pribadi",
    alasan: "Mengurus dokumen penting",
    durasi: "1 hari",
    tanggalMulai: "18/01/2024",
    tanggalSelesai: "18/01/2024",
    status: "Ditolak",
  },
  {
    nama: "Nina Agustina",
    dept: "Pengembangan",
    jenis: "Cuti Tahunan",
    alasan: "Istirahat",
    durasi: "3 hari",
    tanggalMulai: "22/01/2024",
    tanggalSelesai: "24/01/2024",
    status: "Disetujui",
  },
];

const statusOptions = ["Semua", "Menunggu", "Disetujui", "Ditolak"];

const IzinCutiTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const filteredRows = dummyRows.filter((row) => {
    const matchSearch =
      row.nama.toLowerCase().includes(search.toLowerCase()) ||
      row.jenis.toLowerCase().includes(search.toLowerCase()) ||
      row.dept.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Semua" ? true : row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Pengajuan Aktif</span>
          <span className="text-2xl font-bold">
            {dummyStat.aktif}{" "}
            <span className="text-base font-normal text-gray-400">
              pengajuan
            </span>
          </span>
          <span className="text-xs text-blue-600 mt-1">
            {dummyStat.aktifBreakdown}
          </span>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">
            Menunggu Persetujuan
          </span>
          <span className="text-2xl font-bold">{dummyStat.menunggu}</span>
          <span className="text-xs text-yellow-600 mt-1">Perlu tindakan</span>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Riwayat Bulan Ini</span>
          <span className="text-2xl font-bold">{dummyStat.riwayat}</span>
          <span className="text-xs text-green-600 mt-1">
            {dummyStat.riwayatDisetujui} disetujui, {dummyStat.riwayatDitolak}{" "}
            ditolak
          </span>
        </div>
      </div>
      {/* Grafik Tren Pengajuan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 min-w-full md:min-w-[600px]">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-900 dark:text-dark-100">
            Tren Pengajuan Izin & Cuti
          </span>
          <span className="text-sm text-gray-500">Periode: Januari 2024</span>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dummyChart}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="minggu" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Izin" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Cuti" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Tabel Daftar Pengajuan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600">
        <div className="flex items-center justify-between px-6 pt-6">
          <span className="font-semibold text-gray-900 dark:text-dark-100">
            Daftar Pengajuan
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pengajuan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-4 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              />
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-300">
                <Filter className="w-4 h-4" />
                <span>{statusFilter}</span>
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto p-6 pt-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-dark-400 text-left">
                <th className="py-2">KARYAWAN</th>
                <th className="py-2">JENIS</th>
                <th className="py-2">DURASI</th>
                <th className="py-2">STATUS</th>
                <th className="py-2">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-dark-700"
                >
                  <td className="py-2 font-medium text-gray-900 dark:text-dark-100">
                    <div className="flex flex-col">
                      <span>{row.nama}</span>
                      <span className="text-xs text-gray-400">{row.dept}</span>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-col">
                      <span>{row.jenis}</span>
                      <span className="text-xs text-gray-400">
                        {row.alasan}
                      </span>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-col">
                      <span>
                        {row.tanggalMulai}/{row.tanggalSelesai}
                      </span>
                      <span className="text-xs text-gray-400">
                        {row.durasi}
                      </span>
                    </div>
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === "Disetujui"
                          ? "bg-green-100 text-green-700"
                          : row.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <button className="text-blue-600 hover:underline text-xs mr-2">
                      Detail
                    </button>
                    {row.status === "Menunggu" && (
                      <>
                        <button className="text-green-600 hover:underline text-xs mr-2">
                          Setuju
                        </button>
                        <button className="text-red-600 hover:underline text-xs">
                          Tolak
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>
              Menampilkan {filteredRows.length} dari {dummyRows.length}{" "}
              pengajuan
            </span>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded border border-gray-200 dark:border-dark-600">
                Sebelumnya
              </button>
              <button className="px-2 py-1 rounded border border-gray-200 dark:border-dark-600">
                1
              </button>
              <button className="px-2 py-1 rounded border border-gray-200 dark:border-dark-600">
                2
              </button>
              <button className="px-2 py-1 rounded border border-gray-200 dark:border-dark-600">
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IzinCutiTab;
