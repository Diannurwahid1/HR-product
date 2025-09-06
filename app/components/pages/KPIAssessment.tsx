import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { showInfo, showConfirm, showSuccess } from "../../utils/alerts";

interface Employee {
  id: number;
  name: string;
  nik: string;
  department: string;
  position: string;
  kpiScore: number;
  status: "Disetujui" | "Menunggu Persetujuan" | "Draft";
  lastUpdate: string;
  avatar: string;
  departmentColor: string;
}

const KPIAssessment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("Kuartal 1 - 2024");
  const [selectedDepartment, setSelectedDepartment] =
    useState("Semua Departemen");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Tambahkan mapping warna badge departemen
  const defaultDepartmentColor = (dept: string) => {
    switch (dept.toLowerCase()) {
      case "design": return "bg-green-100 text-green-800";
      case "marketing": return "bg-purple-100 text-purple-800";
      case "engineering": return "bg-blue-100 text-blue-800";
      case "finance": return "bg-yellow-100 text-yellow-800";
      case "sales": return "bg-red-100 text-red-800";
      case "customer service": return "bg-indigo-100 text-indigo-800";
      case "it": return "bg-gray-100 text-gray-800";
      case "hr": return "bg-pink-100 text-pink-800";
      case "operations": return "bg-orange-100 text-orange-800";
      case "product": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  // ProgressBar komponen
  function ProgressBar({ value }: { value: number }) {
    return (
      <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    );
  }

  const dummyIndicators = [
    { name: "Penyelesaian Task", score: 4.5, weight: 20 },
    { name: "Kualitas Kode", score: 3.8, weight: 20 },
    { name: "Kepatuhan Standar", score: 4.2, weight: 25 },
    { name: "Penanganan Bug", score: 3.5, weight: 15 },
    { name: "Kerja Tim", score: 4.0, weight: 10 },
    { name: "Komunikasi", score: 3.7, weight: 10 },
  ];

  useEffect(() => {
    setLoading(true);
    fetch("/api/employee/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.employees)) {
          setEmployees(
            data.employees.map((emp: any) => {
              let position = "-";
              if (emp.jobPosition) {
                if (typeof emp.jobPosition === "string") {
                  position = emp.jobPosition;
                } else if (typeof emp.jobPosition === "object" && emp.jobPosition !== null) {
                  position = emp.jobPosition.nama || emp.jobPosition.name || "-";
                }
              }
              let department = "-";
              let departmentColor = "bg-gray-100 text-gray-800";
              if (emp.department) {
                if (typeof emp.department === "string") {
                  department = emp.department;
                  departmentColor = defaultDepartmentColor(emp.department);
                } else if (typeof emp.department === "object" && emp.department !== null) {
                  department = emp.department.nama || emp.department.name || "-";
                  departmentColor = defaultDepartmentColor(department);
                }
              }
              return {
                id: emp.id,
                name: emp.namaLengkap,
                nik: emp.nik || '',
                department,
                position,
                kpiScore: emp.kpiScore || 0,
                status: emp.kpiStatus || "Draft",
                lastUpdate: emp.updatedAt ? new Date(emp.updatedAt).toLocaleDateString("id-ID") : "-",
                avatar: emp.fotoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(emp.namaLengkap),
                departmentColor,
              };
            })
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "Semua Departemen" ||
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Menunggu Persetujuan":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getKPIColor = (score: number) => {
    if (score >= 4.0) return "text-blue-600";
    if (score >= 3.5) return "text-green-600";
    if (score >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressWidth = (score: number) => {
    return (score / 5) * 100;
  };

  const handleViewKPI = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  const handleEditKPI = async (employee: Employee) => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin mengedit KPI ${employee.name}?`
    );
    if (confirmed) {
      showSuccess(`Membuka form edit KPI untuk ${employee.name}`);
    }
  };

  const handleMoreActions = (employee: Employee) => {
    const actions = [
      "1. Lihat Detail KPI",
      "2. Edit Penilaian",
      "3. Cetak Laporan",
      "4. Kirim Notifikasi",
      "5. Riwayat Penilaian",
    ];

    const selectedAction = prompt(
      `Pilih aksi untuk ${employee.name}:\n${actions.join(
        "\n"
      )}\n\nMasukkan nomor pilihan:`
    );

    if (selectedAction) {
      const actionIndex = parseInt(selectedAction) - 1;
      if (actionIndex >= 0 && actionIndex < actions.length) {
        showSuccess(
          `Menjalankan: ${actions[actionIndex].substring(3)} untuk ${
            employee.name
          }`
        );
      }
    }
  };

  const handleCreateAssessment = () => {
    showInfo("Membuka form penilaian KPI baru");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
              Daftar Karyawan KPI
            </h1>
            <p className="text-gray-600 dark:text-dark-400">
              Evaluasi dan monitoring kinerja seluruh karyawan
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Quarter Filter */}
            <div className="relative">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="appearance-none bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-dark-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <option>Kuartal 1 - 2024</option>
                <option>Kuartal 2 - 2024</option>
                <option>Kuartal 3 - 2024</option>
                <option>Kuartal 4 - 2024</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-500 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-dark-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <option>Semua Departemen</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Engineering</option>
                <option>Finance</option>
                <option>Sales</option>
                <option>Customer Service</option>
                <option>IT</option>
                <option>HR</option>
                <option>Operations</option>
                <option>Product</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-500 pointer-events-none" />
            </div>

            <button
              onClick={handleCreateAssessment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Penilaian Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
          </div>

          {/* KPI Table */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-x-auto transition-colors duration-300">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Nama Karyawan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Posisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Nilai KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Status KPI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Terakhir Update</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
              {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4" colSpan={7}>
                        <div className="flex items-center space-x-3 animate-pulse">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-dark-700 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3" />
                        </div>
                      </div>
                      </td>
                    </tr>
                  ))
              ) : (
                currentEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                      {/* Nama Karyawan */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-dark-100 truncate">{employee.name}</p>
                            <p className="text-xs text-gray-500 dark:text-dark-400 truncate">NIK: {employee.nik || '-'}</p>
                          </div>
                        </div>
                      </td>
                      {/* Departemen */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${employee.departmentColor} dark:bg-opacity-20 truncate`}>
                          {employee.department}
                        </span>
                      </td>
                      {/* Posisi */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 dark:text-dark-100 truncate" title={employee.position}>{employee.position}</p>
                      </td>
                      {/* Nilai KPI */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getKPIColor(employee.kpiScore)}`}>{employee.kpiScore.toFixed(1)}</span>
                          <ProgressBar value={employee.kpiScore} />
                        </div>
                      </td>
                      {/* Status KPI */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status)} dark:bg-opacity-20`}>{employee.status}</span>
                      </td>
                      {/* Terakhir Update */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">{employee.lastUpdate}</p>
                      </td>
                      {/* Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleViewKPI(employee)} className="p-2 text-gray-400 dark:text-dark-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEditKPI(employee)} className="p-2 text-gray-400 dark:text-dark-500 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Edit KPI">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleMoreActions(employee)} className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors" title="Aksi Lainnya">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
              )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 border-t border-gray-200 dark:border-dark-600">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-dark-300">
                  Menampilkan {startIndex + 1} sampai{" "}
                  {Math.min(endIndex, filteredEmployees.length)} dari{" "}
                  {filteredEmployees.length} karyawan
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredEmployees.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-dark-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">
                Tidak ada karyawan ditemukan
              </h3>
              <p className="text-gray-500 dark:text-dark-400">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Detail KPI */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 dark:bg-black/70">
          <div className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl w-full max-w-5xl p-0 overflow-hidden relative animate-fadeIn">
            <button onClick={closeDetailModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:text-dark-400 dark:hover:text-dark-100 text-2xl">&times;</button>
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="md:w-72 bg-gray-50 dark:bg-dark-800 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-dark-700">
                <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-dark-100 mb-1">{selectedEmployee.name}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${selectedEmployee.departmentColor}`}>{selectedEmployee.department}</span>
                <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">NIK: {selectedEmployee.nik}</p>
                <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">{selectedEmployee.position}</p>
                <p className="text-xs text-gray-400 dark:text-dark-500 mb-1">Bergabung: 15 Jan 2022</p>
                <p className="text-xs text-gray-400 dark:text-dark-500">Atasan: Rina Wijaya</p>
                {/* Ringkasan KPI */}
                <div className="mt-6 mb-2 flex flex-col items-center">
                  <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray={282.6} strokeDashoffset={282.6 - (selectedEmployee.kpiScore/5)*282.6} strokeLinecap="round" />
                    </svg>
                    <span className="text-3xl font-bold text-blue-600">{selectedEmployee.kpiScore.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-dark-400">dari 5.00</span>
                </div>
                <div className="flex flex-col items-center text-xs text-gray-500 dark:text-dark-400">
                  <span className="mb-1">Status: <span className={`font-semibold ${getStatusColor(selectedEmployee.status)}`}>{selectedEmployee.status}</span></span>
                  <span className="mb-1">Periode: Jan - Mar 2024</span>
                  <span>Terakhir Update: {selectedEmployee.lastUpdate}</span>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 p-8">
                {/* Tabs */}
                <div className="flex space-x-8 border-b border-gray-200 dark:border-dark-700 mb-6">
                  <button className="pb-3 px-1 border-b-2 border-blue-600 text-blue-600 font-semibold">Detail Penilaian</button>
                  <button className="pb-3 px-1 text-gray-500 dark:text-dark-400">Riwayat KPI</button>
                  <button className="pb-3 px-1 text-gray-500 dark:text-dark-400">Integrasi Logbook</button>
                </div>
                {/* Penilaian Indikator KPI */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-100 mb-4">Penilaian Indikator KPI</h3>
                  <div className="space-y-6">
                    {dummyIndicators.map((ind, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-dark-100">{ind.name}</p>
                          <span className="text-xs text-gray-500 dark:text-dark-400">Bobot: {ind.weight}%</span>
                        </div>
                        <div className="flex items-center space-x-4 min-w-[180px]">
                          <span className="text-lg font-bold text-blue-600">{ind.score}</span>
                          <div className="w-40"><ProgressBar value={ind.score} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Catatan & Rekomendasi */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-100 mb-2">Catatan & Rekomendasi</h3>
                  <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 text-sm text-gray-700 dark:text-dark-300">
                    Budi menunjukkan performa yang baik dalam hal kedisiplinan dan kualitas hasil kerja. Perlu peningkatan dalam hal inisiatif dan kecepatan kerja untuk mencapai target yang lebih tinggi di kuartal berikutnya.
                  </div>
                </div>
                {/* Tombol aksi bawah */}
                <div className="flex justify-end space-x-3">
                  <button className="bg-white border border-gray-300 dark:bg-dark-800 dark:border-dark-600 text-gray-700 dark:text-dark-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">Unduh Laporan</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Simpan Penilaian</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIAssessment;
