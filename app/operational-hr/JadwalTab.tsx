import React, { useState } from "react";

export interface JadwalRow {
  nama: string;
  dept: string;
  hari: string;
  jamMasuk: string;
  jamPulang: string;
  role?: string;
  shift?: string;
  badgeColor?: string;
}

export interface JadwalTabProps {
  data: JadwalRow[];
}

const dummyStats = {
  kehadiran: 95,
  karyawan: 42,
  dept: 6,
};

const dummyDepartments = [
  "IT",
  "Keuangan",
  "Marketing",
  "HR",
  "Produksi",
  "Pengembangan",
];

const dummyCalendar = [
  // Array of objects for each day, with shifts (for simplicity, only a few days filled)
  {
    date: 15,
    shifts: [
      { dept: "IT", label: "Pagi", color: "bg-blue-500" },
      { dept: "Keu", label: "Siang", color: "bg-green-500" },
      { dept: "Prod", label: "Malam", color: "bg-purple-500" },
      { dept: "HR", label: "Libur", color: "bg-gray-400" },
    ],
  },
  {
    date: 16,
    shifts: [
      { dept: "Keu", label: "Siang", color: "bg-green-500" },
      { dept: "Prod", label: "Malam", color: "bg-purple-500" },
    ],
  },
  { date: 19, shifts: [{ dept: "Marc", label: "Pagi", color: "bg-blue-500" }] },
];

const dummyDetail = [
  {
    dept: "IT",
    karyawan: [
      {
        nama: "Ahmad Faisal",
        role: "Senior Developer",
        shift: "Pagi",
        badgeColor: "bg-blue-500",
      },
      {
        nama: "Rizki Pratama",
        role: "Backend Developer",
        shift: "Pagi",
        badgeColor: "bg-blue-500",
      },
    ],
  },
  {
    dept: "Keuangan",
    karyawan: [
      {
        nama: "Dewi Sartika",
        role: "Financial Analyst",
        shift: "Siang",
        badgeColor: "bg-green-500",
      },
      {
        nama: "Anita Wijaya",
        role: "Accounting Staff",
        shift: "Siang",
        badgeColor: "bg-green-500",
      },
    ],
  },
  {
    dept: "Marketing",
    karyawan: [
      {
        nama: "Budi Santoso",
        role: "Marketing Manager",
        shift: "Pagi",
        badgeColor: "bg-blue-500",
      },
      {
        nama: "Joko Widodo",
        role: "Sales Executive",
        shift: "Siang",
        badgeColor: "bg-green-500",
      },
    ],
  },
];

const JadwalTab: React.FC<JadwalTabProps> = ({ data }) => {
  const [view, setView] = useState("Bulanan");
  const [month, setMonth] = useState("Januari 2024");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("Semua");

  return (
    <div className="flex flex-col gap-6">
      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">
            Kehadiran Bulan Ini
          </span>
          <span className="text-2xl font-bold">{dummyStats.kehadiran}%</span>
          <span className="text-xs text-green-600 mt-1">
            Meningkat 2% dari bulan lalu
          </span>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Karyawan Aktif</span>
          <span className="text-2xl font-bold">
            {dummyStats.karyawan}{" "}
            <span className="text-base font-normal text-gray-400">
              karyawan
            </span>
          </span>
          <span className="text-xs text-blue-600 mt-1">6 departemen</span>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-start">
          <span className="text-xs text-gray-500 mb-1">Total Departemen</span>
          <span className="text-2xl font-bold">{dummyStats.dept}</span>
          <span className="text-xs text-green-600 mt-1">100% terjadwal</span>
        </div>
      </div>
      {/* Kalender Jadwal */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                view === "Bulanan"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setView("Bulanan")}
            >
              Bulanan
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                view === "Mingguan"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setView("Mingguan")}
            >
              Mingguan
            </button>
            {dummyDepartments.map((d) => (
              <button
                key={d}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  deptFilter === d
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                onClick={() => setDeptFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Cari karyawan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option>Januari 2024</option>
              <option>Februari 2024</option>
            </select>
          </div>
        </div>
        {/* Kalender grid dummy */}
        <div className="grid grid-cols-7 gap-2 text-xs mb-2">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div
              key={d}
              className="font-semibold text-center text-gray-500 dark:text-dark-400"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 min-h-[180px]">
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const cal = dummyCalendar.find((c) => c.date === day);
            return (
              <div
                key={day}
                className="border rounded-lg min-h-[48px] p-1 flex flex-col gap-1 bg-gray-50 dark:bg-dark-900"
              >
                <div className="text-xs font-bold text-gray-700 dark:text-dark-100">
                  {day}
                </div>
                {cal &&
                  cal.shifts.map((s, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-full text-white ${s.color}`}
                    >
                      {s.dept}: {s.label}
                    </span>
                  ))}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>{" "}
            Pagi (07:00-15:00)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>{" "}
            Siang (15:00-23:00)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>{" "}
            Malam (23:00-07:00)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span>{" "}
            Libur (-)
          </span>
        </div>
      </div>
      {/* Detail Jadwal per Departemen */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6">
        <div className="font-semibold mb-4">
          Detail Jadwal per Departemen{" "}
          <span className="text-xs text-gray-400 ml-2">
            Tanggal: 15 Jan 2024
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {dummyDetail.map((dept) => (
            <div key={dept.dept}>
              <div className="font-semibold mb-2">
                {dept.dept}{" "}
                <span className="text-xs text-gray-400">
                  ({dept.karyawan.length} karyawan)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {dept.karyawan.map((k, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                      {k.nama
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{k.nama}</div>
                      <div className="text-xs text-gray-400">{k.role}</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${k.badgeColor}`}
                    >
                      {k.shift}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JadwalTab;
