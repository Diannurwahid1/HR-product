import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  TrendingUp,
  Users,
  Calculator,
  FileText,
  ChevronDown,
  MoreVertical,
} from "lucide-react";
import {
  showSuccess,
  showInfo,
  showConfirm,
  showError,
} from "../../utils/alerts";
import PayrollPage from "./Payroll";

interface SalaryComponent {
  id: string;
  name: string;
  type: "fixed" | "variable";
  amount: number;
  percentage?: number;
  description: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  baseSalary: number;
  totalSalary: number;
  lastUpdated: string;
  avatar: string;
  components: SalaryComponent[];
}

const SalaryMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("Semua Departemen");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [masterGaji, setMasterGaji] = useState<any[]>([]);
  const [loadingGaji, setLoadingGaji] = useState(false);
  const [showGajiModal, setShowGajiModal] = useState(false);
  const [editGaji, setEditGaji] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [gajiForm, setGajiForm] = useState({
    id: "",
    employeeId: "",
    nominal: "",
    berlakuMulai: "",
    berlakuSampai: "",
    status: "Aktif",
    keterangan: "",
  });
  const [gajiFormError, setGajiFormError] = useState("");
  const [komponenGaji, setKomponenGaji] = useState<any[]>([]);
  const [showKomponenModal, setShowKomponenModal] = useState(false);
  const [editKomponen, setEditKomponen] = useState<any>(null);
  const [komponenForm, setKomponenForm] = useState({
    id: "",
    nama: "",
    tipe: "tunjangan",
    defaultNominal: "",
    status: "Aktif",
    keterangan: "",
  });
  const [komponenFormError, setKomponenFormError] = useState("");

  useEffect(() => {
    fetchMasterGaji();
    fetchEmployees();
    fetchKomponenGaji();
  }, []);
  const fetchMasterGaji = async () => {
    setLoadingGaji(true);
    try {
      const res = await fetch("/api/master-gaji/list");
      const data = await res.json();
      if (data.success) setMasterGaji(data.masterGaji);
    } finally {
      setLoadingGaji(false);
    }
  };
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employee/list");
      const data = await res.json();
      if (data.success) setEmployees(data.employees);
    } catch {}
  };
  const fetchKomponenGaji = async () => {
    try {
      const res = await fetch("/api/master-komponen-gaji/list");
      const data = await res.json();
      if (data.success) setKomponenGaji(data.komponen);
    } catch {}
  };
  const openAddGaji = () => {
    setEditGaji(null);
    setGajiForm({
      id: "",
      employeeId: "",
      nominal: "",
      berlakuMulai: "",
      berlakuSampai: "",
      status: "Aktif",
      keterangan: "",
    });
    setShowGajiModal(true);
    setGajiFormError("");
  };
  const openEditGaji = (g: any) => {
    setEditGaji(g);
    setGajiForm({
      id: g.id,
      employeeId: g.employeeId,
      nominal: g.nominal,
      berlakuMulai: g.berlakuMulai ? g.berlakuMulai.slice(0, 10) : "",
      berlakuSampai: g.berlakuSampai ? g.berlakuSampai.slice(0, 10) : "",
      status: g.status,
      keterangan: g.keterangan || "",
    });
    setShowGajiModal(true);
    setGajiFormError("");
  };
  const handleGajiFormChange = (e: any) => {
    const { name, value } = e.target;
    setGajiForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleGajiSubmit = async (e: any) => {
    e.preventDefault();
    setGajiFormError("");
    if (
      !gajiForm.employeeId ||
      !gajiForm.nominal ||
      !gajiForm.berlakuMulai ||
      !gajiForm.status
    ) {
      setGajiFormError("Semua field wajib diisi.");
      return;
    }
    if (isNaN(Number(gajiForm.nominal)) || Number(gajiForm.nominal) <= 0) {
      setGajiFormError("Nominal harus lebih dari 0.");
      return;
    }
    try {
      const res = await fetch(
        editGaji ? "/api/master-gaji/edit" : "/api/master-gaji/add",
        {
          method: editGaji ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...gajiForm,
            nominal: Number(gajiForm.nominal),
            berlakuMulai: gajiForm.berlakuMulai,
            berlakuSampai: gajiForm.berlakuSampai || null,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        showSuccess(
          editGaji
            ? "Gaji pokok berhasil diupdate!"
            : "Gaji pokok berhasil ditambah!"
        );
        setShowGajiModal(false);
        fetchMasterGaji();
      } else {
        setGajiFormError(data.error || "Gagal menyimpan data");
      }
    } catch {
      setGajiFormError("Gagal menyimpan data");
    }
  };
  const handleDeleteGaji = async (id: string) => {
    if (!(await showConfirm("Yakin hapus data gaji pokok ini?"))) return;
    try {
      const res = await fetch("/api/master-gaji/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Data gaji pokok dihapus!");
        fetchMasterGaji();
      } else {
        showError(data.error || "Gagal hapus data");
      }
    } catch {
      showError("Gagal hapus data");
    }
  };

  const openAddKomponen = () => {
    setEditKomponen(null);
    setKomponenForm({
      id: "",
      nama: "",
      tipe: "tunjangan",
      defaultNominal: "",
      status: "Aktif",
      keterangan: "",
    });
    setShowKomponenModal(true);
    setKomponenFormError("");
  };
  const openEditKomponen = (k: any) => {
    setEditKomponen(k);
    setKomponenForm({
      id: k.id,
      nama: k.nama,
      tipe: k.tipe,
      defaultNominal: k.defaultNominal,
      status: k.status,
      keterangan: k.keterangan || "",
    });
    setShowKomponenModal(true);
    setKomponenFormError("");
  };
  const handleKomponenFormChange = (e: any) => {
    const { name, value } = e.target;
    setKomponenForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleKomponenSubmit = async (e: any) => {
    e.preventDefault();
    setKomponenFormError("");
    if (
      !komponenForm.nama ||
      !komponenForm.tipe ||
      !komponenForm.defaultNominal ||
      !komponenForm.status
    ) {
      setKomponenFormError("Semua field wajib diisi.");
      return;
    }
    if (
      isNaN(Number(komponenForm.defaultNominal)) ||
      Number(komponenForm.defaultNominal) <= 0
    ) {
      setKomponenFormError("Nominal harus lebih dari 0.");
      return;
    }
    try {
      const res = await fetch(
        editKomponen
          ? "/api/master-komponen-gaji/edit"
          : "/api/master-komponen-gaji/add",
        {
          method: editKomponen ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...komponenForm,
            defaultNominal: Number(komponenForm.defaultNominal),
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        showSuccess(
          editKomponen
            ? "Komponen berhasil diupdate!"
            : "Komponen berhasil ditambah!"
        );
        setShowKomponenModal(false);
        fetchKomponenGaji();
      } else {
        setKomponenFormError(data.error || "Gagal menyimpan data");
      }
    } catch {
      setKomponenFormError("Gagal menyimpan data");
    }
  };
  const handleDeleteKomponen = async (id: string) => {
    if (!(await showConfirm("Yakin hapus komponen gaji ini?"))) return;
    try {
      const res = await fetch("/api/master-komponen-gaji/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Komponen dihapus!");
        fetchKomponenGaji();
      } else {
        showError(data.error || "Gagal hapus data");
      }
    } catch {
      showError("Gagal hapus data");
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const name = employee.name || employee.namaLengkap || "";
    const position = employee.position || "";
    const department = employee.department || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleEditSalary = async (employee: Employee) => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin mengedit gaji ${employee.name}?`
    );
    if (confirmed) {
      showSuccess(`Membuka form edit gaji untuk ${employee.name}`);
    }
  };

  const handleDeleteSalary = async (employee: Employee) => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin menghapus data gaji ${employee.name}?`
    );
    if (confirmed) {
      showSuccess(`Data gaji ${employee.name} berhasil dihapus`);
    }
  };

  const handleExportData = () => {
    showSuccess("Data gaji berhasil diekspor ke Excel!");
  };

  const handleImportData = () => {
    showInfo("Fitur import data akan segera tersedia");
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      Design:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Development:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Marketing:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      HR: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
    return (
      colors[department] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const renderEmployeesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-dark-100">
          Daftar Gaji Pokok Karyawan
        </h2>
        <button
          onClick={openAddGaji}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" /> <span>Tambah Gaji Pokok</span>
        </button>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow p-6 transition-colors duration-300">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Nama Karyawan
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                NIK
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Nominal
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Berlaku Mulai
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Berlaku Sampai
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Status
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Keterangan
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loadingGaji ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : masterGaji.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-gray-500 dark:text-dark-400"
                >
                  Belum ada data gaji pokok
                </td>
              </tr>
            ) : (
              masterGaji.map((g) => (
                <tr
                  key={g.id}
                  className="border-b border-gray-100 dark:border-dark-700"
                >
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {g.employee?.namaLengkap}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {g.employee?.nik}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-dark-100">
                    Rp {g.nominal.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {g.berlakuMulai?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {g.berlakuSampai ? g.berlakuSampai.slice(0, 10) : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {g.status}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {g.keterangan || "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => openEditGaji(g)}
                    >
                      <Edit className="inline w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:underline"
                      onClick={() => handleDeleteGaji(g.id)}
                    >
                      <Trash2 className="inline w-4 h-4 mr-1" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Tambah/Edit Gaji Pokok */}
      {showGajiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-lg relative transition-colors duration-300">
            <button
              className="absolute top-2 right-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200"
              onClick={() => setShowGajiModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">
              {editGaji ? "Edit" : "Tambah"} Gaji Pokok
            </h2>
            {gajiFormError && (
              <div className="mb-3 text-red-600 dark:text-red-400 text-sm">
                {gajiFormError}
              </div>
            )}
            <form onSubmit={handleGajiSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                  Karyawan
                </label>
                <select
                  name="employeeId"
                  value={gajiForm.employeeId}
                  onChange={handleGajiFormChange}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                  required
                  disabled={!!editGaji}
                >
                  <option value="">Pilih karyawan</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.namaLengkap} ({emp.nik})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Nominal
                  </label>
                  <input
                    type="number"
                    name="nominal"
                    value={gajiForm.nominal}
                    onChange={handleGajiFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    placeholder="5000000"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Status
                  </label>
                  <select
                    name="status"
                    value={gajiForm.status}
                    onChange={handleGajiFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    required
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="mb-3 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Berlaku Mulai
                  </label>
                  <input
                    type="date"
                    name="berlakuMulai"
                    value={gajiForm.berlakuMulai}
                    onChange={handleGajiFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Berlaku Sampai
                  </label>
                  <input
                    type="date"
                    name="berlakuSampai"
                    value={gajiForm.berlakuSampai}
                    onChange={handleGajiFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                  Keterangan
                </label>
                <input
                  type="text"
                  name="keterangan"
                  value={gajiForm.keterangan}
                  onChange={handleGajiFormChange}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                  placeholder="Opsional"
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {editGaji ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderComponentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-dark-100">
          Komponen Gaji (Tunjangan/Potongan)
        </h2>
        <button
          onClick={openAddKomponen}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" /> <span>Tambah Komponen</span>
        </button>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow p-6 transition-colors duration-300">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Nama
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Tipe
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Default Nominal
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Status
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Keterangan
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {komponenGaji.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500 dark:text-dark-400"
                >
                  Belum ada data komponen gaji
                </td>
              </tr>
            ) : (
              komponenGaji.map((k) => (
                <tr
                  key={k.id}
                  className="border-b border-gray-100 dark:border-dark-700"
                >
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {k.nama}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {k.tipe}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-dark-100">
                    Rp {k.defaultNominal.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {k.status}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {k.keterangan || "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => openEditKomponen(k)}
                    >
                      <Edit className="inline w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:underline"
                      onClick={() => handleDeleteKomponen(k.id)}
                    >
                      <Trash2 className="inline w-4 h-4 mr-1" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Tambah/Edit Komponen Gaji */}
      {showKomponenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-lg relative transition-colors duration-300">
            <button
              className="absolute top-2 right-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200"
              onClick={() => setShowKomponenModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">
              {editKomponen ? "Edit" : "Tambah"} Komponen Gaji
            </h2>
            {komponenFormError && (
              <div className="mb-3 text-red-600 dark:text-red-400 text-sm">
                {komponenFormError}
              </div>
            )}
            <form onSubmit={handleKomponenSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                  Nama Komponen
                </label>
                <input
                  type="text"
                  name="nama"
                  value={komponenForm.nama}
                  onChange={handleKomponenFormChange}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                  required
                />
              </div>
              <div className="mb-3 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Tipe
                  </label>
                  <select
                    name="tipe"
                    value={komponenForm.tipe}
                    onChange={handleKomponenFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    required
                  >
                    <option value="tunjangan">Tunjangan</option>
                    <option value="potongan">Potongan</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Default Nominal
                  </label>
                  <input
                    type="number"
                    name="defaultNominal"
                    value={komponenForm.defaultNominal}
                    onChange={handleKomponenFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    required
                  />
                </div>
              </div>
              <div className="mb-3 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Status
                  </label>
                  <select
                    name="status"
                    value={komponenForm.status}
                    onChange={handleKomponenFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    required
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    name="keterangan"
                    value={komponenForm.keterangan}
                    onChange={handleKomponenFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {editKomponen ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Perhitungan statistik card
  const gajiAktif = masterGaji.filter((g) => g.status === "Aktif");
  const totalGaji = gajiAktif.reduce((sum, g) => sum + (g.nominal || 0), 0);
  const rataRataGaji = gajiAktif.length > 0 ? totalGaji / gajiAktif.length : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-primary dark:bg-dark-800 border-b border-primary dark:border-dark-600 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary dark:text-dark-100">
              Master Gaji Pokok
            </h1>
            <p className="text-secondary dark:text-dark-400">
              Kelola data gaji pokok dan tunjangan tetap karyawan
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-secondary dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-primary dark:bg-dark-800 rounded-xl p-6 border border-primary dark:border-dark-600 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary dark:text-dark-400">
                    Total Karyawan
                  </p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">
                    {employees.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary dark:bg-dark-800 rounded-xl p-6 border border-primary dark:border-dark-600 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary dark:text-dark-400">
                    Rata-rata Gaji
                  </p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">
                    {formatCurrency(rataRataGaji)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary dark:bg-dark-800 rounded-xl p-6 border border-primary dark:border-dark-600 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary dark:text-dark-400">
                    Total Penggajian
                  </p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">
                    {formatCurrency(totalGaji)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary dark:bg-dark-800 rounded-xl p-6 border border-primary dark:border-dark-600 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary dark:text-dark-400">
                    Komponen Tunjangan
                  </p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">
                    {komponenGaji.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-primary dark:bg-dark-800 rounded-xl border border-primary dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "employees"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200"
                }`}
              >
                Daftar Gaji Pokok Karyawan
              </button>
              <button
                onClick={() => setActiveTab("components")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "components"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200"
                }`}
              >
                Komponen Tunjangan Tetap
              </button>
              <button
                onClick={() => setActiveTab("payroll")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "payroll"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200"
                }`}
              >
                Payroll
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "employees" ? (
            renderEmployeesTab()
          ) : activeTab === "components" ? (
            renderComponentsTab()
          ) : (
            <PayrollPage />
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transition-colors duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-primary dark:border-dark-600">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-primary dark:text-dark-100">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-sm text-secondary dark:text-dark-400">
                    {selectedEmployee.position}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200 rounded-lg hover:bg-tertiary dark:hover:bg-dark-700 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Salary Summary */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-tertiary dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-secondary dark:text-dark-400 mb-1">
                    Gaji Pokok
                  </p>
                  <p className="text-xl font-bold text-primary dark:text-dark-100">
                    {formatCurrency(selectedEmployee.baseSalary)}
                  </p>
                </div>
                <div className="bg-tertiary dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-secondary dark:text-dark-400 mb-1">
                    Total Gaji
                  </p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(selectedEmployee.totalSalary)}
                  </p>
                </div>
              </div>

              {/* Salary Components */}
              <div>
                <h3 className="text-lg font-semibold text-primary dark:text-dark-100 mb-4">
                  Komponen Tunjangan Tetap
                </h3>
                <div className="space-y-3">
                  {selectedEmployee.components.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center justify-between p-4 bg-tertiary dark:bg-dark-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-primary dark:text-dark-100">
                          {component.name}
                        </p>
                        <p className="text-sm text-secondary dark:text-dark-400">
                          {component.description}
                        </p>
                      </div>
                      <p className="font-semibold text-primary dark:text-dark-100">
                        {formatCurrency(component.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between text-sm text-blue-800 dark:text-blue-300 mb-2">
                  <span>Gaji Pokok:</span>
                  <span>{formatCurrency(selectedEmployee.baseSalary)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-blue-800 dark:text-blue-300 mb-2">
                  <span>Total Tunjangan:</span>
                  <span>
                    {formatCurrency(
                      selectedEmployee.totalSalary - selectedEmployee.baseSalary
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-blue-900 dark:text-blue-200 pt-2 border-t border-blue-200 dark:border-blue-700">
                  <span>Total Gaji:</span>
                  <span>{formatCurrency(selectedEmployee.totalSalary)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryMaster;
