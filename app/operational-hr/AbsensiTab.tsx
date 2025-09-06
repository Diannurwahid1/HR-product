import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
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

export interface KehadiranRow {
  nama: string;
  dept: string;
  jam: string;
  status: string;
}

export interface AbsensiTabProps {
  stats: {
    totalKehadiran: number;
    totalKaryawan: number;
    tepatWaktu: number;
    terlambat: number;
  };
  chartData?: number[];
  chartLabels?: string[];
  kehadiran: KehadiranRow[];
}

// Data dummy untuk grafik bar chart
const dummyChartData = [
  { hari: "Sen", Hadir: 20, Terlambat: 2 },
  { hari: "Sel", Hadir: 18, Terlambat: 3 },
  { hari: "Rab", Hadir: 19, Terlambat: 1 },
  { hari: "Kam", Hadir: 21, Terlambat: 2 },
  { hari: "Jum", Hadir: 17, Terlambat: 4 },
  { hari: "Sab", Hadir: 15, Terlambat: 2 },
];

const AbsensiTab: React.FC<AbsensiTabProps> = ({ stats, kehadiran }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const statusOptions = ["Semua", "Tepat Waktu", "Terlambat"];

  // Filter data berdasarkan search dan status
  const filteredKehadiran = kehadiran.filter((row) => {
    const matchSearch =
      row.nama.toLowerCase().includes(search.toLowerCase()) ||
      row.dept.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Semua" ? true : row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Total Kehadiran</span>
          <span className="text-2xl font-bold">
            {stats.totalKehadiran}{" "}
            <span className="text-base font-normal text-gray-400">
              / {stats.totalKaryawan} Karyawan
            </span>
          </span>
          <span className="text-xs text-green-600 mt-1">
            {((stats.totalKehadiran / stats.totalKaryawan) * 100).toFixed(1)}%
            hadir hari ini
          </span>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Tepat Waktu</span>
          <span className="text-2xl font-bold">{stats.tepatWaktu}</span>
          <span className="text-xs text-green-600 mt-1">
            {((stats.tepatWaktu / stats.totalKehadiran) * 100).toFixed(1)}% dari
            kehadiran
          </span>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Terlambat</span>
          <span className="text-2xl font-bold">{stats.terlambat}</span>
          <span className="text-xs text-orange-600 mt-1">
            {((stats.terlambat / stats.totalKehadiran) * 100).toFixed(1)}% dari
            kehadiran
          </span>
        </div>
      </div>
      {/* Grafik Kehadiran Mingguan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 min-w-full md:min-w-[600px]">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-900 dark:text-dark-100">
            Grafik Kehadiran Mingguan
          </span>
          <span className="text-sm text-gray-500">Periode: Minggu Ini</span>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dummyChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hari" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Hadir" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Terlambat" fill="#f59e42" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Tabel Kehadiran Hari Ini */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600">
        <div className="flex items-center justify-between px-6 pt-6">
          <span className="font-semibold text-gray-900 dark:text-dark-100">
            Daftar Kehadiran Karyawan Hari Ini
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama atau departemen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
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
                <th className="py-2">NAMA</th>
                <th className="py-2">DEPARTEMEN</th>
                <th className="py-2">JAM MASUK</th>
                <th className="py-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredKehadiran.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-dark-700"
                >
                  <td className="py-2 font-medium text-gray-900 dark:text-dark-100">
                    {row.nama}
                  </td>
                  <td className="py-2">{row.dept}</td>
                  <td className="py-2">{row.jam}</td>
                  <td className="py-2">
                    {row.status === "Tepat Waktu" ? (
                      <Badge color="bg-green-100 text-green-700">
                        Tepat Waktu
                      </Badge>
                    ) : (
                      <Badge color="bg-orange-100 text-orange-700">
                        Terlambat
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
            <span>Menampilkan {filteredKehadiran.length} karyawan</span>
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
    </>
  );
};

export default AbsensiTab;
