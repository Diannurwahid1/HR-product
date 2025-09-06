import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Shield,
  Target,
  Bell,
  Building,
  Database,
  Activity,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Check,
  X,
  Download,
  HelpCircle,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import {
  showSuccess,
  showError,
  showLoading,
  showInfo,
  showConfirm,
} from "../../utils/alerts";
import { useAuth } from "../../context/AuthContext";

interface Permission {
  id: string;
  name: string;
  admin: boolean;
  manager: boolean;
  hrStaff: boolean;
  employee: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedRole, setSelectedRole] = useState("Semua Peran");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showDeletePermissionConfirm, setShowDeletePermissionConfirm] =
    useState(false);
  const [deletePermissionId, setDeletePermissionId] = useState("");

  // State dari backend
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal tambah role
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  // State untuk modal tambah permission
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [newPermName, setNewPermName] = useState("");
  const [newPermDesc, setNewPermDesc] = useState("");

  // State untuk modal edit permission
  const [showEditPermissionModal, setShowEditPermissionModal] = useState(false);
  const [editPermId, setEditPermId] = useState("");
  const [editPermName, setEditPermName] = useState("");
  const [editPermDesc, setEditPermDesc] = useState("");

  // Tambah state untuk Bank CRUD
  type Bank = { id: string; name: string; code: string; logo?: string };
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [showAddEditBankModal, setShowAddEditBankModal] = useState(false);
  const [editBank, setEditBank] = useState<Bank | null>(null);
  const [bankForm, setBankForm] = useState<{
    name: string;
    code: string;
    logo?: string;
  }>({ name: "", code: "", logo: "" });
  const [deleteBankId, setDeleteBankId] = useState<string | null>(null);

  // Tambah state global untuk loading submit dan error form
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Tambah state untuk Shift CRUD
  type Shift = {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
  };
  // --- STATE SHIFT MASTER ---
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftLoading, setShiftLoading] = useState(false);
  const [shiftSearch, setShiftSearch] = useState("");
  const [showAddEditShiftModal, setShowAddEditShiftModal] = useState(false);
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [shiftForm, setShiftForm] = useState<{
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
  }>({ name: "", startTime: "", endTime: "", description: "" });
  const [deleteShiftId, setDeleteShiftId] = useState<string | null>(null);

  // Tambah state untuk Department CRUD
  type Department = { id: string; name: string; description?: string };
  // --- STATE DEPARTMENT MASTER ---
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [showAddEditDepartmentModal, setShowAddEditDepartmentModal] =
    useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [departmentForm, setDepartmentForm] = useState<{
    name: string;
    description?: string;
  }>({ name: "", description: "" });
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string | null>(
    null
  );

  // Tambah state untuk Location CRUD
  type Location = {
    id: string;
    name: string;
    address?: string;
    description?: string;
  };
  // ... existing code ...
  // --- STATE LOCATION MASTER ---
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [showAddEditLocationModal, setShowAddEditLocationModal] =
    useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [locationForm, setLocationForm] = useState<{
    name: string;
    address?: string;
    description?: string;
  }>({ name: "", address: "", description: "" });
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);

  // Tambah state untuk Holiday CRUD
  type Holiday = {
    id: string;
    name: string;
    date: string;
    description?: string;
  };
  // ... existing code ...
  // --- STATE HOLIDAY MASTER ---
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidayLoading, setHolidayLoading] = useState(false);
  const [holidaySearch, setHolidaySearch] = useState("");
  const [showAddEditHolidayModal, setShowAddEditHolidayModal] = useState(false);
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);
  const [holidayForm, setHolidayForm] = useState<{
    name: string;
    date: string;
    description?: string;
  }>({ name: "", date: "", description: "" });
  const [deleteHolidayId, setDeleteHolidayId] = useState<string | null>(null);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roleRes, permRes] = await Promise.all([
          fetch("/api/role/list").then((r) => r.json()),
          fetch("/api/permission/list").then((r) => r.json()),
        ]);
        setRoles(roleRes.roles || []);
        setPermissions(permRes.permissions || []);
      } catch (err) {
        showError("Gagal mengambil data role/permission");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FETCH BANK DATA ---
  const fetchBanks = async () => {
    setBankLoading(true);
    try {
      const res = await fetch("/api/master/bank/list");
      const data = await res.json();
      setBanks(data.banks || []);
    } catch {
      showError("Gagal mengambil data bank");
    } finally {
      setBankLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === "master-bank") fetchBanks();
    // eslint-disable-next-line
  }, [activeSection]);

  // --- FETCH SHIFT DATA ---
  const fetchShifts = async () => {
    setShiftLoading(true);
    try {
      const res = await fetch("/api/master/shift/list");
      const data = await res.json();
      setShifts(data.shifts || []);
    } catch {
      showError("Gagal mengambil data shift");
    } finally {
      setShiftLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === "master-shift") fetchShifts();
    // eslint-disable-next-line
  }, [activeSection]);

  // --- FETCH DEPARTMENT DATA ---
  const fetchDepartments = async () => {
    setDepartmentLoading(true);
    try {
      const res = await fetch("/api/master/department/list");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch {
      showError("Gagal mengambil data department");
    } finally {
      setDepartmentLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === "master-department") fetchDepartments();
    // eslint-disable-next-line
  }, [activeSection]);

  // --- FETCH LOCATION DATA ---
  const fetchLocations = async () => {
    setLocationLoading(true);
    try {
      const res = await fetch("/api/master/location/list");
      const data = await res.json();
      setLocations(data.locations || []);
    } catch {
      showError("Gagal mengambil data location");
    } finally {
      setLocationLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === "master-location") fetchLocations();
    // eslint-disable-next-line
  }, [activeSection]);

  // --- FETCH HOLIDAY DATA ---
  const fetchHolidays = async () => {
    setHolidayLoading(true);
    try {
      const res = await fetch("/api/master/holiday/list");
      const data = await res.json();
      setHolidays(data.holidays || []);
    } catch {
      showError("Gagal mengambil data holiday");
    } finally {
      setHolidayLoading(false);
    }
  };
  useEffect(() => {
    if (activeSection === "master-holiday") fetchHolidays();
    // eslint-disable-next-line
  }, [activeSection]);

  // Handler toggle permission
  const handlePermissionChange = async (
    roleId: string,
    permissionId: string,
    allowed: boolean
  ) => {
    try {
      await fetch("/api/role-permission/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, permissionId, allowed }),
      });
      // Refresh data
      const [roleRes, permRes] = await Promise.all([
        fetch("/api/role/list").then((r) => r.json()),
        fetch("/api/permission/list").then((r) => r.json()),
      ]);
      setRoles(roleRes.roles || []);
      setPermissions(permRes.permissions || []);
      showSuccess("Izin berhasil diperbarui");
    } catch (err) {
      showError("Gagal update permission");
    }
  };

  // Handler tambah role
  const handleAddRole = async (name: string, description: string) => {
    try {
      await fetch("/api/role/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const roleRes = await fetch("/api/role/list").then((r) => r.json());
      setRoles(roleRes.roles || []);
      showSuccess("Peran baru berhasil ditambahkan!");
    } catch (err) {
      showError("Gagal menambah peran");
    }
  };

  // Handler hapus role
  const handleDeleteRole = async (id: string) => {
    try {
      await fetch("/api/role/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const roleRes = await fetch("/api/role/list").then((r) => r.json());
      setRoles(roleRes.roles || []);
      showSuccess("Peran berhasil dihapus");
    } catch (err) {
      showError("Gagal menghapus peran");
    }
  };

  // Handler tambah permission
  const handleAddPermission = async (name: string, description: string) => {
    try {
      await fetch("/api/permission/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const permRes = await fetch("/api/permission/list").then((r) => r.json());
      setPermissions(permRes.permissions || []);
      showSuccess("Permission baru berhasil ditambahkan!");
    } catch (err) {
      showError("Gagal menambah permission");
    }
  };

  // Handler hapus permission
  const handleDeletePermission = async (id: string) => {
    try {
      await fetch("/api/permission/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const permRes = await fetch("/api/permission/list").then((r) => r.json());
      setPermissions(permRes.permissions || []);
      showSuccess("Permission berhasil dihapus");
    } catch (err) {
      showError("Gagal menghapus permission");
    }
  };

  // Handler edit permission
  const handleEditPermission = async (
    id: string,
    name: string,
    description: string
  ) => {
    try {
      await fetch("/api/permission/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, description }),
      });
      const permRes = await fetch("/api/permission/list").then((r) => r.json());
      setPermissions(permRes.permissions || []);
      showSuccess("Permission berhasil diupdate!");
    } catch (err) {
      showError("Gagal update permission");
    }
  };

  // --- HANDLER TAMBAH/EDIT BANK ---
  const handleOpenAddBank = () => {
    setEditBank(null);
    setBankForm({ name: "", code: "", logo: "" });
    setShowAddEditBankModal(true);
  };
  const handleOpenEditBank = (bank: Bank) => {
    setEditBank(bank);
    setBankForm({ name: bank.name, code: bank.code, logo: bank.logo || "" });
    setShowAddEditBankModal(true);
  };
  const handleSaveBank = async () => {
    setFormError(null);
    if (!bankForm.name || !bankForm.code) {
      setFormError("Nama dan kode bank wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      let res;
      if (editBank) {
        res = await fetch("/api/master/bank/edit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editBank.id, ...bankForm }),
        });
      } else {
        res = await fetch("/api/master/bank/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bankForm),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan data bank");
        return;
      }
      showSuccess(
        editBank ? "Bank berhasil diupdate" : "Bank berhasil ditambahkan"
      );
      setShowAddEditBankModal(false);
      fetchBanks();
    } catch {
      setFormError("Gagal menyimpan data bank");
    } finally {
      setFormLoading(false);
    }
  };
  // --- HANDLER HAPUS BANK ---
  const handleDeleteBank = async () => {
    if (!deleteBankId) return;
    try {
      await fetch("/api/master/bank/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteBankId }),
      });
      showSuccess("Bank berhasil dihapus");
      setDeleteBankId(null);
      fetchBanks();
    } catch {
      showError("Gagal menghapus bank");
    }
  };

  // --- HANDLER TAMBAH/EDIT SHIFT ---
  const handleOpenAddShift = () => {
    setEditShift(null);
    setShiftForm({ name: "", startTime: "", endTime: "", description: "" });
    setShowAddEditShiftModal(true);
  };
  const handleOpenEditShift = (shift: Shift) => {
    setEditShift(shift);
    setShiftForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      description: shift.description || "",
    });
    setShowAddEditShiftModal(true);
  };
  const handleSaveShift = async () => {
    setFormError(null);
    if (!shiftForm.name || !shiftForm.startTime || !shiftForm.endTime) {
      setFormError("Nama, jam masuk, dan jam keluar wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      let res;
      if (editShift) {
        res = await fetch("/api/master/shift/edit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editShift.id, ...shiftForm }),
        });
      } else {
        res = await fetch("/api/master/shift/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shiftForm),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan data shift");
        return;
      }
      showSuccess(
        editShift ? "Shift berhasil diupdate" : "Shift berhasil ditambahkan"
      );
      setShowAddEditShiftModal(false);
      fetchShifts();
    } catch {
      setFormError("Gagal menyimpan data shift");
    } finally {
      setFormLoading(false);
    }
  };
  // --- HANDLER HAPUS SHIFT ---
  const handleDeleteShift = async () => {
    if (!deleteShiftId) return;
    try {
      await fetch("/api/master/shift/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteShiftId }),
      });
      showSuccess("Shift berhasil dihapus");
      setDeleteShiftId(null);
      fetchShifts();
    } catch {
      showError("Gagal menghapus shift");
    }
  };

  // --- HANDLER TAMBAH/EDIT DEPARTMENT ---
  const handleOpenAddDepartment = () => {
    setEditDepartment(null);
    setDepartmentForm({ name: "", description: "" });
    setShowAddEditDepartmentModal(true);
  };
  const handleOpenEditDepartment = (department: Department) => {
    setEditDepartment(department);
    setDepartmentForm({
      name: department.name,
      description: department.description || "",
    });
    setShowAddEditDepartmentModal(true);
  };
  const handleSaveDepartment = async () => {
    setFormError(null);
    if (!departmentForm.name) {
      setFormError("Nama department wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      let res;
      if (editDepartment) {
        res = await fetch("/api/master/department/edit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editDepartment.id, ...departmentForm }),
        });
      } else {
        res = await fetch("/api/master/department/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(departmentForm),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan data department");
        return;
      }
      showSuccess(
        editDepartment
          ? "Department berhasil diupdate"
          : "Department berhasil ditambahkan"
      );
      setShowAddEditDepartmentModal(false);
      fetchDepartments();
    } catch {
      setFormError("Gagal menyimpan data department");
    } finally {
      setFormLoading(false);
    }
  };
  // --- HANDLER HAPUS DEPARTMENT ---
  const handleDeleteDepartment = async () => {
    if (!deleteDepartmentId) return;
    try {
      await fetch("/api/master/department/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteDepartmentId }),
      });
      showSuccess("Department berhasil dihapus");
      setDeleteDepartmentId(null);
      fetchDepartments();
    } catch {
      showError("Gagal menghapus department");
    }
  };

  // --- HANDLER TAMBAH/EDIT LOCATION ---
  const handleOpenAddLocation = () => {
    setEditLocation(null);
    setLocationForm({ name: "", address: "", description: "" });
    setShowAddEditLocationModal(true);
  };
  const handleOpenEditLocation = (location: Location) => {
    setEditLocation(location);
    setLocationForm({
      name: location.name,
      address: location.address || "",
      description: location.description || "",
    });
    setShowAddEditLocationModal(true);
  };
  const handleSaveLocation = async () => {
    setFormError(null);
    if (!locationForm.name) {
      setFormError("Nama lokasi wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      let res;
      if (editLocation) {
        res = await fetch("/api/master/location/edit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editLocation.id, ...locationForm }),
        });
      } else {
        res = await fetch("/api/master/location/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationForm),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan data location");
        return;
      }
      showSuccess(
        editLocation
          ? "Location berhasil diupdate"
          : "Location berhasil ditambahkan"
      );
      setShowAddEditLocationModal(false);
      fetchLocations();
    } catch {
      setFormError("Gagal menyimpan data location");
    } finally {
      setFormLoading(false);
    }
  };
  // --- HANDLER HAPUS LOCATION ---
  const handleDeleteLocation = async () => {
    if (!deleteLocationId) return;
    try {
      await fetch("/api/master/location/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteLocationId }),
      });
      showSuccess("Location berhasil dihapus");
      setDeleteLocationId(null);
      fetchLocations();
    } catch {
      showError("Gagal menghapus location");
    }
  };

  // --- HANDLER TAMBAH/EDIT HOLIDAY ---
  const handleOpenAddHoliday = () => {
    setEditHoliday(null);
    setHolidayForm({ name: "", date: "", description: "" });
    setShowAddEditHolidayModal(true);
  };
  const handleOpenEditHoliday = (holiday: Holiday) => {
    setEditHoliday(holiday);
    setHolidayForm({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description || "",
    });
    setShowAddEditHolidayModal(true);
  };
  const handleSaveHoliday = async () => {
    setFormError(null);
    if (!holidayForm.name || !holidayForm.date) {
      setFormError("Nama dan tanggal wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      let res;
      if (editHoliday) {
        res = await fetch("/api/master/holiday/edit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editHoliday.id, ...holidayForm }),
        });
      } else {
        res = await fetch("/api/master/holiday/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(holidayForm),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan data holiday");
        return;
      }
      showSuccess(
        editHoliday
          ? "Holiday berhasil diupdate"
          : "Holiday berhasil ditambahkan"
      );
      setShowAddEditHolidayModal(false);
      fetchHolidays();
    } catch {
      setFormError("Gagal menyimpan data holiday");
    } finally {
      setFormLoading(false);
    }
  };
  // --- HANDLER HAPUS HOLIDAY ---
  const handleDeleteHoliday = async () => {
    if (!deleteHolidayId) return;
    try {
      await fetch("/api/master/holiday/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteHolidayId }),
      });
      showSuccess("Holiday berhasil dihapus");
      setDeleteHolidayId(null);
      fetchHolidays();
    } catch {
      showError("Gagal menghapus holiday");
    }
  };

  const handleSaveChanges = () => {
    showLoading(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve("success");
        }, 1500);
      }),
      {
        loading: "Menyimpan perubahan...",
        success: "Pengaturan berhasil disimpan!",
        error: "Gagal menyimpan pengaturan",
      }
    );
  };

  const handleExportConfig = () => {
    const config = {
      permissions,
      companySettings,
      notificationSettings,
      backupSettings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "system-configuration.json";
    link.click();

    showSuccess("Konfigurasi berhasil diekspor!");
  };

  const handleBackup = () => {
    showLoading(
      new Promise((resolve) => {
        setTimeout(() => {
          setBackupSettings((prev) => ({
            ...prev,
            lastBackup: new Date().toLocaleDateString("id-ID"),
          }));
          resolve("success");
        }, 2000);
      }),
      {
        loading: "Membuat backup...",
        success: "Backup berhasil dibuat!",
        error: "Gagal membuat backup",
      }
    );
  };

  const handleRestore = () => {
    showLoading(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve("success");
          } else {
            reject("error");
          }
        }, 2000);
      }),
      {
        loading: "Memulihkan data...",
        success: "Data berhasil dipulihkan!",
        error: "Gagal memulihkan data",
      }
    );
  };

  const settingsCards = [
    {
      id: "roles",
      title: "Role & Permission",
      description: "Pengaturan peran pengguna dan hak akses",
      icon: Shield,
      color: "bg-blue-50 text-blue-600",
      stats: "5 peran terdaftar",
      action: "Kelola",
    },
    {
      id: "kpi",
      title: "Konfigurasi KPI",
      description: "Pengaturan indikator kinerja untuk karyawan",
      icon: Target,
      color: "bg-green-50 text-green-600",
      stats: "12 indikator aktif",
      action: "Kelola",
    },
    {
      id: "notifications",
      title: "Pengaturan Notifikasi",
      description: "Konfigurasi notifikasi email dan sistem",
      icon: Bell,
      color: "bg-purple-50 text-purple-600",
      stats: "8 template tersedia",
      action: "Kelola",
    },
    {
      id: "company",
      title: "Pengaturan Perusahaan",
      description: "Informasi perusahaan dan identitas",
      icon: Building,
      color: "bg-orange-50 text-orange-600",
      stats: "Terakhir diperbarui 12/01/2024",
      action: "Kelola",
    },
    {
      id: "backup",
      title: "Backup & Restore",
      description: "Pengaturan cadangan dan pemulihan data",
      icon: Database,
      color: "bg-cyan-50 text-cyan-600",
      stats: "Backup terakhir 28/01/2024",
      action: "Kelola",
    },
    {
      id: "activity",
      title: "Log Aktivitas",
      description: "Catatan aktivitas penggunaan sistem",
      icon: Activity,
      color: "bg-red-50 text-red-600",
      stats: "247 aktivitas bulan ini",
      action: "Lihat",
    },
    {
      id: "master-bank",
      title: "Master Bank",
      description: "Kelola data bank untuk payroll dan kebutuhan lain",
      icon: Building, // ganti BankIcon menjadi Building
      color: "bg-teal-50 text-teal-600",
      stats: "",
      action: "Kelola",
    },
    {
      id: "master-shift",
      title: "Master Shift",
      description: "Kelola data shift kerja karyawan",
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      stats: "",
      action: "Kelola",
    },
    {
      id: "master-department",
      title: "Master Department",
      description: "Kelola data departemen perusahaan",
      icon: Building,
      color: "bg-pink-50 text-pink-600",
      stats: "",
      action: "Kelola",
    },
    {
      id: "master-location",
      title: "Master Location",
      description: "Kelola data lokasi kerja perusahaan",
      icon: MapPin,
      color: "bg-green-50 text-green-600",
      stats: "",
      action: "Kelola",
    },
    {
      id: "master-holiday",
      title: "Master Holiday",
      description: "Kelola data hari libur perusahaan",
      icon: Calendar,
      color: "bg-indigo-50 text-indigo-600",
      stats: "",
      action: "Kelola",
    },
    {
      id: "master-job-position",
      title: "Master Jabatan",
      description: "Kelola data jabatan/posisi perusahaan",
      icon: Briefcase,
      color: "bg-indigo-50 text-indigo-600",
      stats: "",
      action: "Kelola",
    },
  ];

  // Filter settingsCards: tab master hanya untuk admin/hr
  const isMasterAllowed =
    user && ["admin", "hr"].includes(user.role.toLowerCase());
  const filteredSettingsCards = settingsCards.filter((card) => {
    if (
      [
        "master-bank",
        "master-shift",
        "master-department",
        "master-location",
        "master-holiday",
        "master-job-position",
      ].includes(card.id)
    ) {
      return isMasterAllowed;
    }
    return true;
  });

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSettingsCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setActiveSection(card.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                >
                  {card.action}
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{card.description}</p>
              <p className="text-blue-600 text-sm font-medium">{card.stats}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Table mapping
  const renderRolesPermissions = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 pr-8 text-sm text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option
                value="Semua Peran"
                className="bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                Semua Peran
              </option>
              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.name}
                  className="bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                >
                  {role.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-400" />
            <input
              type="text"
              placeholder="Cari fungsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-dark-400 transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddRoleModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Peran</span>
          </button>
        </div>
      </div>
      {/* Permissions Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-dark-100">
                  Fungsi Sistem
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="text-center py-4 px-4 font-medium text-gray-700 dark:text-dark-100"
                  >
                    {role.name}
                  </th>
                ))}
                <th className="text-center py-4 px-4 font-medium text-gray-700 dark:text-dark-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {permissions
                .filter((permission) =>
                  permission.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((permission) => (
                  <tr
                    key={permission.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-dark-100">
                      {permission.name}
                    </td>
                    {roles.map((role) => {
                      const rp = permission.roles.find(
                        (r: any) => r.roleId === role.id
                      );
                      return (
                        <td key={role.id} className="py-4 px-4 text-center">
                          <button
                            onClick={() =>
                              handlePermissionChange(
                                role.id,
                                permission.id,
                                !rp?.allowed
                              )
                            }
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              rp?.allowed
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 dark:bg-dark-600 text-gray-400 dark:text-dark-400"
                            }`}
                          >
                            {rp?.allowed && <Check className="w-4 h-4" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setEditPermId(permission.id);
                            setEditPermName(permission.name);
                            setEditPermDesc(permission.description || "");
                            setShowEditPermissionModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-dark-700 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletePermissionId(permission.id);
                            setShowDeletePermissionConfirm(true);
                          }}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-dark-700 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 text-sm text-gray-600 dark:text-dark-200">
          Menampilkan {permissions.length} fungsi sistem
        </div>
      </div>
    </div>
  );

  const renderBankMaster = () => {
    const filteredBanks = banks.filter(
      (b) =>
        b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
        b.code.toLowerCase().includes(bankSearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100">
            Master Bank
          </h2>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={handleOpenAddBank}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bank</span>
          </button>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Cari nama/kode bank..."
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-dark-400 transition-colors"
          />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Nama Bank
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Kode
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Logo
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-700 dark:text-dark-100">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {bankLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-8 w-16 bg-gray-200 dark:bg-dark-700 rounded animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredBanks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Tidak ada data bank
                  </td>
                </tr>
              ) : (
                filteredBanks.map((bank) => (
                  <tr
                    key={bank.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-dark-100">
                      {bank.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {bank.code}
                    </td>
                    <td className="py-3 px-4">
                      {bank.logo ? (
                        <img src={bank.logo} alt={bank.name} className="h-8" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditBank(bank)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteBankId(bank.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-dark-700 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal Tambah/Edit Bank */}
        {showAddEditBankModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                {editBank ? "Edit Bank" : "Tambah Bank"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    value={bankForm.name}
                    onChange={(e) =>
                      setBankForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nama bank"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Kode Bank
                  </label>
                  <input
                    type="text"
                    value={bankForm.code}
                    onChange={(e) =>
                      setBankForm((f) => ({ ...f, code: e.target.value }))
                    }
                    placeholder="Kode bank"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Logo (URL opsional)
                  </label>
                  <input
                    type="text"
                    value={bankForm.logo || ""}
                    onChange={(e) =>
                      setBankForm((f) => ({ ...f, logo: e.target.value }))
                    }
                    placeholder="URL logo bank (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEditBankModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveBank}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Konfirmasi Hapus */}
        {deleteBankId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 dark:text-dark-400 mb-6">
                Apakah Anda yakin ingin menghapus bank ini?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteBankId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteBank}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderShiftMaster = () => {
    const filteredShifts = shifts.filter(
      (s) =>
        s.name.toLowerCase().includes(shiftSearch.toLowerCase()) ||
        s.startTime.toLowerCase().includes(shiftSearch.toLowerCase()) ||
        s.endTime.toLowerCase().includes(shiftSearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100">
            Master Shift
          </h2>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={handleOpenAddShift}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Shift</span>
          </button>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Cari nama/jam shift..."
            value={shiftSearch}
            onChange={(e) => setShiftSearch(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-dark-400 transition-colors"
          />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Nama Shift
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Jam Masuk
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Jam Keluar
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Deskripsi
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-700 dark:text-dark-100">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {shiftLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    Tidak ada data shift
                  </td>
                </tr>
              ) : (
                filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-dark-100">
                      {shift.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {shift.startTime}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {shift.endTime}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {shift.description || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditShift(shift)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteShiftId(shift.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-dark-700 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal Tambah/Edit Shift */}
        {showAddEditShiftModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                {editShift ? "Edit Shift" : "Tambah Shift"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Nama Shift
                  </label>
                  <input
                    type="text"
                    value={shiftForm.name}
                    onChange={(e) =>
                      setShiftForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nama shift"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Jam Masuk (HH:mm)
                  </label>
                  <input
                    type="time"
                    value={shiftForm.startTime}
                    onChange={(e) =>
                      setShiftForm((f) => ({ ...f, startTime: e.target.value }))
                    }
                    placeholder="Jam masuk"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Jam Keluar (HH:mm)
                  </label>
                  <input
                    type="time"
                    value={shiftForm.endTime}
                    onChange={(e) =>
                      setShiftForm((f) => ({ ...f, endTime: e.target.value }))
                    }
                    placeholder="Jam keluar"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Deskripsi (opsional)
                  </label>
                  <input
                    type="text"
                    value={shiftForm.description || ""}
                    onChange={(e) =>
                      setShiftForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi shift (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEditShiftModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveShift}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Konfirmasi Hapus */}
        {deleteShiftId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 dark:text-dark-400 mb-6">
                Apakah Anda yakin ingin menghapus shift ini?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteShiftId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteShift}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDepartmentMaster = () => {
    const filteredDepartments = departments.filter(
      (d) =>
        d.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
        (d.description || "")
          .toLowerCase()
          .includes(departmentSearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100">
            Master Department
          </h2>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={handleOpenAddDepartment}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Department</span>
          </button>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Cari nama/desk department..."
            value={departmentSearch}
            onChange={(e) => setDepartmentSearch(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-dark-400 transition-colors"
          />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Nama Department
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Deskripsi
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-700 dark:text-dark-100">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {departmentLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">
                    Tidak ada data department
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-dark-100">
                      {department.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {department.description || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditDepartment(department)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDepartmentId(department.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-dark-700 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal Tambah/Edit Department */}
        {showAddEditDepartmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                {editDepartment ? "Edit Department" : "Tambah Department"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Nama Department
                  </label>
                  <input
                    type="text"
                    value={departmentForm.name}
                    onChange={(e) =>
                      setDepartmentForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nama department"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Deskripsi (opsional)
                  </label>
                  <input
                    type="text"
                    value={departmentForm.description || ""}
                    onChange={(e) =>
                      setDepartmentForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi department (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEditDepartmentModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveDepartment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Konfirmasi Hapus */}
        {deleteDepartmentId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 dark:text-dark-400 mb-6">
                Apakah Anda yakin ingin menghapus department ini?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteDepartmentId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteDepartment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLocationMaster = () => {
    const filteredLocations = locations.filter(
      (l) =>
        l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
        (l.address || "")
          .toLowerCase()
          .includes(locationSearch.toLowerCase()) ||
        (l.description || "")
          .toLowerCase()
          .includes(locationSearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100">
            Master Location
          </h2>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={handleOpenAddLocation}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Location</span>
          </button>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Cari nama/alamat/desk lokasi..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-dark-400 transition-colors"
          />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Nama Lokasi
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Alamat
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Deskripsi
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-700 dark:text-dark-100">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {locationLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Tidak ada data lokasi
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => (
                  <tr
                    key={location.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-dark-100">
                      {location.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {location.address || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {location.description || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditLocation(location)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteLocationId(location.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-dark-700 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal Tambah/Edit Location */}
        {showAddEditLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                {editLocation ? "Edit Location" : "Tambah Location"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Nama Lokasi
                  </label>
                  <input
                    type="text"
                    value={locationForm.name}
                    onChange={(e) =>
                      setLocationForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nama lokasi"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Alamat (opsional)
                  </label>
                  <input
                    type="text"
                    value={locationForm.address || ""}
                    onChange={(e) =>
                      setLocationForm((f) => ({
                        ...f,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Alamat lokasi (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Deskripsi (opsional)
                  </label>
                  <input
                    type="text"
                    value={locationForm.description || ""}
                    onChange={(e) =>
                      setLocationForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi lokasi (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEditLocationModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Konfirmasi Hapus */}
        {deleteLocationId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 dark:text-dark-400 mb-6">
                Apakah Anda yakin ingin menghapus lokasi ini?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteLocationId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteLocation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHolidayMaster = () => {
    const filteredHolidays = holidays.filter(
      (h) =>
        h.name.toLowerCase().includes(holidaySearch.toLowerCase()) ||
        h.date.toLowerCase().includes(holidaySearch.toLowerCase()) ||
        (h.description || "")
          .toLowerCase()
          .includes(holidaySearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100">
            Master Holiday
          </h2>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={handleOpenAddHoliday}
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Holiday</span>
          </button>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Cari nama/tanggal/desk holiday..."
            value={holidaySearch}
            onChange={(e) => setHolidaySearch(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 dark:placeholder-dark-400 transition-colors"
          />
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Nama Holiday
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Tanggal
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 dark:text-dark-100">
                  Deskripsi
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-700 dark:text-dark-100">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {holidayLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredHolidays.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Tidak ada data holiday
                  </td>
                </tr>
              ) : (
                filteredHolidays.map((holiday) => (
                  <tr
                    key={holiday.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-dark-100">
                      {holiday.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {new Date(holiday.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-dark-200">
                      {holiday.description || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditHoliday(holiday)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-dark-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteHolidayId(holiday.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-dark-700 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal Tambah/Edit Holiday */}
        {showAddEditHolidayModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                {editHoliday ? "Edit Holiday" : "Tambah Holiday"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Nama Holiday
                  </label>
                  <input
                    type="text"
                    value={holidayForm.name}
                    onChange={(e) =>
                      setHolidayForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nama holiday"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={holidayForm.date}
                    onChange={(e) =>
                      setHolidayForm((f) => ({ ...f, date: e.target.value }))
                    }
                    placeholder="Tanggal holiday"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Deskripsi (opsional)
                  </label>
                  <input
                    type="text"
                    value={holidayForm.description || ""}
                    onChange={(e) =>
                      setHolidayForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi holiday (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEditHolidayModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveHoliday}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Konfirmasi Hapus */}
        {deleteHolidayId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 dark:text-dark-400 mb-6">
                Apakah Anda yakin ingin menghapus holiday ini?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteHolidayId(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteHoliday}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tambahkan komponen skeleton untuk Master Jabatan
  const MasterJobPositionPage = () => {
    const [jobPositions, setJobPositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [formError, setFormError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchJobPositions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/master/job-position/list");
        const data = await res.json();
        if (data.success) setJobPositions(data.jobPositions);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchJobPositions();
    }, []);

    const openAdd = () => {
      setEditData(null);
      setForm({ name: "", description: "" });
      setShowModal(true);
      setFormError("");
    };
    const openEdit = (jp: any) => {
      setEditData(jp);
      setForm({ name: jp.name, description: jp.description || "" });
      setShowModal(true);
      setFormError("");
    };
    const handleFormChange = (e: any) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      setFormError("");
      if (!form.name) {
        setFormError("Nama jabatan wajib diisi.");
        return;
      }
      try {
        const res = await fetch(
          editData
            ? "/api/master/job-position/edit"
            : "/api/master/job-position/add",
          {
            method: editData ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              editData ? { id: editData.id, ...form } : form
            ),
          }
        );
        const data = await res.json();
        if (data.success) {
          setShowModal(false);
          fetchJobPositions();
        } else {
          setFormError(data.error || "Gagal menyimpan data");
        }
      } catch {
        setFormError("Gagal menyimpan data");
      }
    };
    const handleDelete = async (id: string) => {
      const confirmed = await showConfirm(
        "Yakin hapus jabatan ini? Data tidak dapat dikembalikan."
      );
      if (!confirmed) return;
      try {
        const res = await fetch("/api/master/job-position/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
          showSuccess("Data jabatan berhasil dihapus!");
          fetchJobPositions();
        } else {
          showError(data.error || "Gagal hapus data");
        }
      } catch {
        showError("Gagal hapus data");
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-dark-100">
            Master Jabatan
          </h2>
          <button
            onClick={openAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Tambah Jabatan</span>
          </button>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600">
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-dark-400">
              Loading...
            </div>
          ) : jobPositions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-dark-400">
              Belum ada data jabatan
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-700">
                  <th className="px-4 py-2 text-left">Nama Jabatan</th>
                  <th className="px-4 py-2 text-left">Deskripsi</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jobPositions.map((jp) => (
                  <tr
                    key={jp.id}
                    className="border-b border-gray-100 dark:border-dark-700"
                  >
                    <td className="px-4 py-2">{jp.name}</td>
                    <td className="px-4 py-2">{jp.description || "-"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={() => openEdit(jp)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 dark:text-red-400 hover:underline"
                        onClick={() => handleDelete(jp.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-dark-600">
              <h3 className="text-lg font-bold mb-4">
                {editData ? "Edit Jabatan" : "Tambah Jabatan"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Jabatan
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                  />
                </div>
                {formError && (
                  <div className="text-red-500 text-sm">{formError}</div>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-dark-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                  >
                    {editData ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "roles":
        return renderRolesPermissions();
      case "kpi":
        return (
          <div className="bg-white rounded-xl p-8 text-center">
            <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Konfigurasi KPI
            </h3>
            <p className="text-gray-500 mb-6">
              Pengaturan indikator kinerja untuk evaluasi karyawan.
            </p>
            <button
              onClick={() => showSuccess("Membuka konfigurasi KPI")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Kelola KPI
            </button>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">
              Pengaturan Notifikasi
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Terima notifikasi melalui email
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNotificationSettings((prev) => ({
                      ...prev,
                      emailNotifications: !prev.emailNotifications,
                    }));
                    showSuccess("Pengaturan email diperbarui");
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.emailNotifications
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationSettings.emailNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">
                    Terima notifikasi push
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNotificationSettings((prev) => ({
                      ...prev,
                      pushNotifications: !prev.pushNotifications,
                    }));
                    showSuccess("Pengaturan push notification diperbarui");
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.pushNotifications
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationSettings.pushNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      case "backup":
        return (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Backup & Restore</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Backup Data</h4>
                <p className="text-sm text-gray-600">
                  Backup terakhir: {backupSettings.lastBackup}
                </p>
                <button
                  onClick={handleBackup}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Buat Backup Sekarang
                </button>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Restore Data</h4>
                <p className="text-sm text-gray-600">
                  Pulihkan data dari backup
                </p>
                <button
                  onClick={handleRestore}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Restore Data
                </button>
              </div>
            </div>
          </div>
        );
      case "master-bank":
        return renderBankMaster();
      case "master-shift":
        return renderShiftMaster();
      case "master-department":
        return renderDepartmentMaster();
      case "master-location":
        return renderLocationMaster();
      case "master-holiday":
        return renderHolidayMaster();
      case "master-job-position":
        return <MasterJobPositionPage />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
              Pengaturan Sistem Admin
            </h1>
            <p className="text-gray-600 dark:text-dark-400">
              Kelola konfigurasi sistem dan hak akses
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => showInfo("Bantuan akan segera tersedia")}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan</span>
            </button>
            <button
              onClick={handleExportConfig}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Konfigurasi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {activeSection !== "overview" && (
        <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600 px-6 transition-colors duration-300">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection("overview")}
              className="py-4 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-medium"
            >
              ← Kembali ke Overview
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">{renderSection()}</div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-6">
              Apakah Anda yakin ingin menghapus izin ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Tambah Peran Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Nama Peran
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Masukkan nama peran"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Deskripsi peran"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddRoleModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await handleAddRole(newRoleName, newRoleDesc);
                  setShowAddRoleModal(false);
                  setNewRoleName("");
                  setNewRoleDesc("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Permission Modal */}
      {showAddPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Tambah Permission Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Nama Permission
                </label>
                <input
                  type="text"
                  value={newPermName}
                  onChange={(e) => setNewPermName(e.target.value)}
                  placeholder="Masukkan nama permission"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={newPermDesc}
                  onChange={(e) => setNewPermDesc(e.target.value)}
                  placeholder="Deskripsi permission"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddPermissionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await handleAddPermission(newPermName, newPermDesc);
                  setShowAddPermissionModal(false);
                  setNewPermName("");
                  setNewPermDesc("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Edit Permission
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Nama Permission
                </label>
                <input
                  type="text"
                  value={editPermName}
                  onChange={(e) => setEditPermName(e.target.value)}
                  placeholder="Masukkan nama permission"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={editPermDesc}
                  onChange={(e) => setEditPermDesc(e.target.value)}
                  placeholder="Deskripsi permission"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditPermissionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await handleEditPermission(
                    editPermId,
                    editPermName,
                    editPermDesc
                  );
                  setShowEditPermissionModal(false);
                  setEditPermId("");
                  setEditPermName("");
                  setEditPermDesc("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeletePermissionConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-6">
              Apakah Anda yakin ingin menghapus permission ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeletePermissionConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await handleDeletePermission(deletePermissionId);
                  setShowDeletePermissionConfirm(false);
                  setDeletePermissionId("");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
