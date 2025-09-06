import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List, Calendar } from "lucide-react";
import { showSuccess, showInfo, showConfirm } from "../../utils/alerts";
import ContractCard from "../ContractCard";
import ContractSidebar from "../ContractSidebar";
import AddContractForm from "../AddContractForm";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/navigation";

const Contracts: React.FC = () => {
  const [activeTab, setActiveTab] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("semua");
  const [filterDept, setFilterDept] = useState<string>("semua");
  const [masterDepartments, setMasterDepartments] = useState<any[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [contractToEdit, setContractToEdit] = useState<any>(null);
  const [editContract, setEditContract] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [logContract, setLogContract] = useState<any>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [extendMode, setExtendMode] = useState(false);

  const router = useRouter();

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contract/list");
      const data = await res.json();
      if (data.success) {
        setContracts(data.contracts);
      }
    } catch (err) {
      showInfo("Gagal mengambil data kontrak");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
    // Fetch master department
    fetch("/api/master/department/list")
      .then((r) => r.json())
      .then((data) => setMasterDepartments(data.departments || []));
  }, []);

  const contractTypes = Array.from(
    new Set(contracts.map((c) => c.jenisKontrak).filter(Boolean))
  );
  const departments = Array.from(
    new Set(contracts.map((c) => c.departemen).filter(Boolean))
  );

  const filteredContracts = contracts.filter((contract) => {
    const employeeName = contract.employee?.namaLengkap || "";
    const employeePosition = contract.posisiJabatan || "";
    const employeeDepartment =
      contract.department?.name || contract.departemen || "";
    const nomorKontrak = contract.nomorKontrak || "";
    const matchesSearch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeePosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomorKontrak.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getContractStatus(contract);
    const matchesTab =
      activeTab === "semua" ||
      (activeTab === "aktif" && status === "Aktif") ||
      (activeTab === "berakhir-segera" && status === "Berakhir Segera") ||
      (activeTab === "berakhir" && status === "Berakhir");
    const matchesType =
      filterType === "semua" || contract.jenisKontrak === filterType;
    const matchesDept =
      filterDept === "semua" || employeeDepartment === filterDept;
    return matchesSearch && matchesTab && matchesType && matchesDept;
  });

  const getTabCount = (status: string) => {
    if (status === "semua") return contracts.length;
    if (status === "aktif")
      return contracts.filter((c) => c.status === "Aktif").length;
    if (status === "berakhir-segera")
      return contracts.filter((c) => c.status === "Berakhir Segera").length;
    if (status === "berakhir")
      return contracts.filter((c) => c.status === "Berakhir").length;
    if (status === "dibatalkan") return 0;
    return 0;
  };

  const handleAddContract = () => {
    setShowAddForm(true);
  };

  const handleBackToList = () => {
    setShowAddForm(false);
  };

  const handleSaveContract = (contractData: any) => {
    showSuccess("Kontrak berhasil disimpan!");
    setShowAddForm(false);
    fetchContracts();
  };

  const handleEditContract = (contract: any) => {
    setContractToEdit(contract);
    setShowEditForm(true);
  };
  const handleBackFromEdit = () => {
    setShowEditForm(false);
    setContractToEdit(null);
    fetchContracts();
  };
  const handleDeleteContract = async (contract: any) => {
    const confirmed = await showConfirm(
      `Yakin hapus kontrak "${contract.nomorKontrak || "-"}"?`
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/contract/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contract.id }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Kontrak berhasil dihapus!");
        fetchContracts();
      } else {
        showInfo(data.error || "Gagal hapus kontrak");
      }
    } catch {
      showInfo("Gagal hapus kontrak");
    }
  };
  const handleExtendContract = (contract: any) => {
    setEditContract(contract);
    setExtendMode(true);
    setShowEditModal(true);
  };
  const handleLogExtension = (contract: any) => {
    setLogContract(contract);
    setShowLogModal(true);
  };

  const handleFilter = () => {
    const filterOptions = [
      "Semua Status",
      "Aktif",
      "Berakhir Segera",
      "Berakhir",
      "Jenis Kontrak: PKWT",
      "Jenis Kontrak: PKWTT",
      "Departemen: Design",
      "Departemen: Development",
      "Departemen: HR",
    ];

    const selectedFilter = prompt(
      `Pilih filter:\n${filterOptions
        .map((option, index) => `${index + 1}. ${option}`)
        .join("\n")}\n\nMasukkan nomor pilihan:`
    );

    if (selectedFilter && filterOptions[parseInt(selectedFilter) - 1]) {
      showSuccess(
        `Filter diterapkan: ${filterOptions[parseInt(selectedFilter) - 1]}`
      );
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  function getContractStatus(contract: any) {
    if (!contract.tanggalBerakhir) return "Aktif";
    const now = new Date();
    const end = new Date(contract.tanggalBerakhir);
    const diffDays = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 0) return "Berakhir";
    if (diffDays <= 30) return "Berakhir Segera";
    return "Aktif";
  }

  // Statistik dinamis
  const totalAktif = contracts.filter(
    (c) => getContractStatus(c) === "Aktif"
  ).length;
  const totalBerakhirSegera = contracts.filter(
    (c) => getContractStatus(c) === "Berakhir Segera"
  ).length;
  const totalBerakhir = contracts.filter(
    (c) => getContractStatus(c) === "Berakhir"
  ).length;
  const totalSemua = contracts.length;

  // If showing add form, render the form instead
  if (showAddForm) {
    return (
      <AddContractForm onBack={handleBackToList} onSave={handleSaveContract} />
    );
  }

  if (showEditForm && contractToEdit) {
    return (
      <AddContractForm
        initialData={contractToEdit}
        isEditMode={true}
        onBack={handleBackFromEdit}
        onSave={handleBackFromEdit}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
              Kontrak Kerja
            </h1>
            <p className="text-gray-600 dark:text-dark-400">
              Manajemen dokumen & informasi kontrak karyawan
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddContract}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kontrak</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex items-center space-x-4 transition-colors duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-400">
                  Total Kontrak Aktif
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                  {totalAktif}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex items-center space-x-4 transition-colors duration-300">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⚠</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-400">
                  Berakhir Segera
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                  {totalBerakhirSegera}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex items-center space-x-4 transition-colors duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-400">
                  Memerlukan Perpanjangan
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                  {totalBerakhir}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1">
                {[
                  { id: "semua", label: "Semua", count: totalSemua },
                  { id: "aktif", label: "Aktif", count: totalAktif },
                  {
                    id: "berakhir-segera",
                    label: "Berakhir Segera",
                    count: totalBerakhirSegera,
                  },
                  { id: "berakhir", label: "Berakhir", count: totalBerakhir },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activeTab === tab.id
                          ? "bg-blue-200 dark:bg-blue-800"
                          : "bg-gray-200 dark:bg-dark-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Controls & Filter Dropdown */}
              <div className="flex items-center space-x-3">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-300">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 divide-y divide-gray-100 dark:divide-dark-700 rounded-md shadow-lg focus:outline-none z-50">
                    <div className="p-2">
                      <div className="mb-2">
                        <span className="block text-xs text-gray-500 dark:text-dark-400 mb-1">
                          Jenis Kontrak
                        </span>
                        <select
                          className="w-full border border-gray-300 dark:border-dark-600 rounded p-1 text-sm bg-white dark:bg-dark-700"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="semua">Semua</option>
                          {contractTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 dark:text-dark-400 mb-1">
                          Departemen
                        </span>
                        <select
                          className="w-full border border-gray-300 dark:border-dark-600 rounded p-1 text-sm bg-white dark:bg-dark-700"
                          value={filterDept}
                          onChange={(e) => setFilterDept(e.target.value)}
                        >
                          <option value="semua">Semua</option>
                          {masterDepartments.map((dept) => (
                            <option key={dept.id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Menu.Items>
                </Menu>
                <button
                  onClick={() => {
                    setFilterType("semua");
                    setFilterDept("semua");
                    setSearchTerm("");
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-sm"
                >
                  Reset Filter
                </button>
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-dark-600 shadow-sm"
                        : ""
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-white dark:bg-dark-600 shadow-sm"
                        : ""
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-300"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kontrak berdasarkan nama, posisi, atau departemen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
          </div>

          {/* Contracts Grid */}
          {loading ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-dark-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-2" />
                  <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded w-full mb-4" />
                  <div className="flex space-x-2">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-dark-700 rounded" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-dark-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredContracts.map((contract) => {
                const status = getContractStatus(contract);
                return (
                  <ContractCard
                    key={contract.id}
                    contract={{
                      ...contract,
                      employee: {
                        name: contract.employee?.namaLengkap || "-",
                        position:
                          contract.jobPosition?.name ||
                          contract.posisiJabatan ||
                          "-",
                        department:
                          contract.department?.name ||
                          contract.departemen ||
                          "-",
                        avatar:
                          contract.employee?.foto || "/default-avatar.png",
                      },
                      jobPosition: contract.jobPosition,
                      posisiJabatan: contract.posisiJabatan,
                      department: contract.department,
                      departemen: contract.departemen,
                      status,
                      type: contract.jenisKontrak || "-",
                      startDate: contract.tanggalMulai
                        ? new Date(contract.tanggalMulai).toLocaleDateString(
                            "id-ID"
                          )
                        : "-",
                      endDate: contract.tanggalBerakhir
                        ? new Date(contract.tanggalBerakhir).toLocaleDateString(
                            "id-ID"
                          )
                        : "-",
                      duration: contract.durasiKontrak || "-",
                      statusColor:
                        status === "Aktif"
                          ? "green"
                          : status === "Berakhir Segera"
                          ? "yellow"
                          : "red",
                      progressColor:
                        status === "Aktif"
                          ? "green"
                          : status === "Berakhir Segera"
                          ? "yellow"
                          : "red",
                    }}
                    onEdit={() => handleEditContract(contract)}
                    onDelete={() => handleDeleteContract(contract)}
                    onExtend={() => handleExtendContract(contract)}
                    onLog={() => handleLogExtension(contract)}
                  />
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredContracts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-dark-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">
                Tidak ada kontrak ditemukan
              </h3>
              <p className="text-gray-500 dark:text-dark-400">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Calendar Button - Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors lg:hidden flex items-center justify-center"
      >
        <Calendar className="w-6 h-6" />
      </button>

      {/* Contract Sidebar */}
      <ContractSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Modal Edit/Perpanjang Kontrak */}
      {/* Hapus modal edit/perpanjang, biarkan routing ke halaman edit */}
      {/* Modal Log Perpanjangan */}
      {showLogModal && logContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 w-full max-w-lg border border-gray-200 dark:border-dark-600">
            <h3 className="text-lg font-bold mb-4">Log Perpanjangan Kontrak</h3>
            <ul className="space-y-2 mb-4">
              {/* Dummy log, bisa diisi dari API jika ada */}
              <li>01 Jan 2023: Kontrak Dibuat (12 bulan)</li>
              <li>15 Nov 2023: Perpanjangan Diajukan (12 bulan)</li>
              <li>01 Dec 2023: Perpanjangan Disetujui (12 bulan)</li>
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-dark-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
