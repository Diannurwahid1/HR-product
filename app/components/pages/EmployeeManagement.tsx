import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";
import { showSuccess, showError } from "../../utils/alerts";
import EmployeeCard from "../EmployeeCard";
import AddEmployeeForm from "../AddEmployeeForm";
import EmployeeDetail from "./EmployeeDetail";

const EmployeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employee/list");
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      } else {
        showError(data.error || "Gagal mengambil data karyawan");
      }
    } catch (err) {
      showError("Gagal mengambil data karyawan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees
    .filter((employee) => {
      const matchesSearch =
        employee.namaLengkap
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Aktif" && employee.status === "Aktif") ||
        (statusFilter === "Nonaktif" && employee.status === "Nonaktif");
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.status === b.status) return 0;
      if (a.status === "Aktif") return -1;
      if (b.status === "Aktif") return 1;
      return 0;
    });

  const totalEmployees = employees.length;
  // You can add status/active logic if you add such fields to Employee

  const handleAddEmployee = () => {
    setShowAddForm(true);
  };

  const handleBackToList = () => {
    setShowAddForm(false);
    fetchEmployees();
  };

  const handleSaveEmployee = async (employeeData: any) => {
    try {
      const res = await fetch("/api/employee/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...employeeData,
          foto: employeeData.files?.foto || null,
          ktp: employeeData.files?.ktp || null,
          npwp: employeeData.files?.npwp || null,
          ijazah: employeeData.files?.ijazah || null,
          cv: employeeData.files?.cv || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Data karyawan berhasil disimpan!");
        setShowAddForm(false);
        fetchEmployees();
      } else {
        showError(data.error || "Gagal menyimpan data karyawan");
      }
    } catch (err) {
      showError("Gagal menyimpan data karyawan");
    }
  };

  const handleViewDetail = (employeeId: string) => {
    setSelectedEmployeeId(Number(employeeId));
    setShowDetailView(true);
  };

  const handleBackFromDetail = () => {
    setShowDetailView(false);
    setSelectedEmployeeId(null);
    fetchEmployees();
  };

  const handleEditEmployee = (employeeId: string) => {
    const emp = employees.find((e) => e.id === Number(employeeId));
    if (emp) {
      setEmployeeToEdit(emp);
      setShowEditForm(true);
    }
  };
  const handleBackFromEdit = () => {
    setShowEditForm(false);
    setEmployeeToEdit(null);
    fetchEmployees();
  };
  const handleUpdateEmployee = async (employeeData: any) => {
    try {
      const res = await fetch(`/api/employee/update?id=${employeeToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...employeeData,
          foto: employeeData.files?.foto || null,
          ktp: employeeData.files?.ktp || null,
          npwp: employeeData.files?.npwp || null,
          ijazah: employeeData.files?.ijazah || null,
          cv: employeeData.files?.cv || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Data karyawan berhasil diupdate!");
        setShowEditForm(false);
        setEmployeeToEdit(null);
        fetchEmployees();
      } else {
        showError(data.error || "Gagal mengupdate data karyawan");
      }
    } catch (err) {
      showError("Gagal mengupdate data karyawan");
    }
  };

  const handleDeactivateEmployee = async (employeeId: string) => {
    try {
      const res = await fetch(`/api/employee/update?id=${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Nonaktif" }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Karyawan berhasil dinonaktifkan!");
        fetchEmployees();
      } else {
        showError(data.error || "Gagal menonaktifkan karyawan");
      }
    } catch (err) {
      showError("Gagal menonaktifkan karyawan");
    }
  };

  const handleActivateEmployee = async (employeeId: string) => {
    try {
      const res = await fetch(`/api/employee/update?id=${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Aktif" }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Karyawan berhasil diaktifkan!");
        fetchEmployees();
      } else {
        showError(data.error || "Gagal mengaktifkan karyawan");
      }
    } catch (err) {
      showError("Gagal mengaktifkan karyawan");
    }
  };

  // If showing add form, render the form instead
  if (showAddForm) {
    return (
      <AddEmployeeForm onBack={handleBackToList} onSave={handleSaveEmployee} />
    );
  }

  // If showing detail view, render the detail page instead
  if (showDetailView && selectedEmployeeId) {
    return (
      <EmployeeDetail
        employeeId={selectedEmployeeId}
        onBack={handleBackFromDetail}
      />
    );
  }

  if (showEditForm && employeeToEdit) {
    return (
      <AddEmployeeForm
        onBack={handleBackFromEdit}
        onSave={handleUpdateEmployee}
        initialData={employeeToEdit}
        isEditMode={true}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
              Manajemen Karyawan
            </h1>
            <p className="text-gray-600 dark:text-dark-400">
              Kelola data karyawan perusahaan Anda
            </p>
          </div>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-dark-400 mb-2">
                Total Karyawan
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">
                {totalEmployees}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2 mb-4">
            <span>Status:</span>
            <button
              className={`px-3 py-1 rounded font-medium transition-colors duration-200
                ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-dark-700 dark:text-dark-100 hover:bg-gray-300 dark:hover:bg-dark-600"
                }
              `}
              onClick={() => setStatusFilter("all")}
            >
              Semua
            </button>
            <button
              className={`px-3 py-1 rounded font-medium transition-colors duration-200
                ${
                  statusFilter === "Aktif"
                    ? "bg-green-600 text-white dark:bg-green-500 dark:text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-dark-700 dark:text-dark-100 hover:bg-gray-300 dark:hover:bg-dark-600"
                }
              `}
              onClick={() => setStatusFilter("Aktif")}
            >
              Aktif
            </button>
            <button
              className={`px-3 py-1 rounded font-medium transition-colors duration-200
                ${
                  statusFilter === "Nonaktif"
                    ? "bg-red-600 text-white dark:bg-red-500 dark:text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-dark-700 dark:text-dark-100 hover:bg-gray-300 dark:hover:bg-dark-600"
                }
              `}
              onClick={() => setStatusFilter("Nonaktif")}
            >
              Nonaktif
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari karyawan berdasarkan nama, email, atau username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            />
          </div>

          {/* Employee Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={{
                    id: employee.id.toString(),
                    name: employee.namaLengkap,
                    email: employee.email,
                    position: employee.username, // or another field if available
                    division: employee.department?.name || "-",
                    status: employee.status || "Aktif",
                    avatar:
                      employee.foto ||
                      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
                    divisionColor: "bg-gray-100 text-gray-800",
                    nik: employee.nik,
                  }}
                  onViewDetail={handleViewDetail}
                  onEdit={handleEditEmployee}
                  onDeactivate={handleDeactivateEmployee}
                  onActivate={handleActivateEmployee}
                />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              Tidak ada karyawan ditemukan
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeManagement;
