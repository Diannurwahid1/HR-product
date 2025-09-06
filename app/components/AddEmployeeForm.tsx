import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Save,
  X,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { showSuccess, showConfirm, showError } from "../utils/alerts";
import FileUpload from "./FileUpload";

interface AddEmployeeFormProps {
  onBack: () => void;
  onSave: (employeeData: any) => void;
  initialData?: any;
  isEditMode?: boolean;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
  onBack,
  onSave,
  initialData,
  isEditMode,
}) => {
  const [formData, setFormData] = useState({
    namaLengkap: initialData?.namaLengkap || "",
    email: initialData?.email || "",
    nomorTelepon: initialData?.nomorTelepon || "",
    tanggalLahir: initialData?.tanggalLahir || "",
    jenisKelamin: initialData?.jenisKelamin || "",
    nomorRekening: initialData?.nomorRekening || "",
    idBank: initialData?.idBank || "",
    idDepartment: initialData?.idDepartment || "",
    idShift: initialData?.idShift || "",
    idLocation: initialData?.idLocation || "",
    alamat: initialData?.alamat || "",
    username: initialData?.username || "",
    password: "", // password tidak diisi default saat edit
  });

  const [files, setFiles] = useState({
    foto: null as File | null,
    ktp: null as File | null,
    npwp: null as File | null,
    ijazah: null as File | null,
    cv: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  type Bank = { id: string; name: string; code: string };
  type Department = { id: string; name: string };
  type Shift = { id: string; name: string };
  type Location = { id: string; name: string };
  const [banks, setBanks] = useState<Bank[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        namaLengkap: initialData.namaLengkap || "",
        email: initialData.email || "",
        nomorTelepon: initialData.nomorTelepon || "",
        tanggalLahir: initialData.tanggalLahir || "",
        jenisKelamin: initialData.jenisKelamin || "",
        nomorRekening: initialData.nomorRekening || "",
        idBank: initialData.idBank || "",
        idDepartment: initialData.idDepartment || "",
        idShift: initialData.idShift || "",
        idLocation: initialData.idLocation || "",
        alamat: initialData.alamat || "",
        username: initialData.username || "",
        password: "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [bankRes, deptRes, shiftRes, locRes] = await Promise.all([
          fetch("/api/master/bank/list").then((r) => r.json()),
          fetch("/api/master/department/list").then((r) => r.json()),
          fetch("/api/master/shift/list").then((r) => r.json()),
          fetch("/api/master/location/list").then((r) => r.json()),
        ]);
        setBanks(bankRes.banks || []);
        setDepartments(deptRes.departments || []);
        setShifts(shiftRes.shifts || []);
        setLocations(locRes.locations || []);
      } catch {}
    };
    fetchMasters();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (fileType: string, file: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [fileType]: file,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.nomorTelepon.trim()) {
      newErrors.nomorTelepon = "Nomor telepon wajib diisi";
    }

    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    }

    if (!formData.jenisKelamin) {
      newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    }

    if (!isEditMode) {
      if (!formData.password.trim()) {
        newErrors.password = "Password wajib diisi";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }
    } else {
      if (formData.password && formData.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataObj.append(key, value);
        });
        Object.entries(files).forEach(([key, file]) => {
          if (file) formDataObj.append(key, file);
        });
        const res = await fetch(
          isEditMode
            ? `/api/employee/update?id=${initialData?.id}`
            : "/api/employee/add",
          {
            method: isEditMode ? "PUT" : "POST",
            body: formDataObj,
          }
        );
        const data = await res.json();
        if (data.success) {
          showSuccess(
            isEditMode
              ? "Data karyawan berhasil diupdate!"
              : "Data karyawan berhasil disimpan!"
          );
          onSave(data.employee);
          setFormData({
            namaLengkap: "",
            email: "",
            nomorTelepon: "",
            tanggalLahir: "",
            jenisKelamin: "",
            nomorRekening: "",
            idBank: "",
            idDepartment: "",
            idShift: "",
            idLocation: "",
            alamat: "",
            username: "",
            password: "",
          });
          setFiles({
            foto: null,
            ktp: null,
            npwp: null,
            ijazah: null,
            cv: null,
          });
        } else {
          showError(
            data.error ||
              (isEditMode
                ? "Gagal update data karyawan"
                : "Gagal menyimpan data karyawan")
          );
        }
      } catch (error) {
        showError(
          isEditMode
            ? "Gagal update data karyawan"
            : "Gagal menyimpan data karyawan"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = async () => {
    const confirmed = await showConfirm(
      "Apakah Anda yakin ingin membatalkan? Data yang sudah diisi akan hilang."
    );
    if (confirmed) {
      onBack();
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate personal info before proceeding
      const personalErrors: { [key: string]: string } = {};

      if (!formData.namaLengkap.trim())
        personalErrors.namaLengkap = "Nama lengkap wajib diisi";
      if (!formData.email.trim()) personalErrors.email = "Email wajib diisi";
      if (!formData.nomorTelepon.trim())
        personalErrors.nomorTelepon = "Nomor telepon wajib diisi";

      if (Object.keys(personalErrors).length > 0) {
        setErrors(personalErrors);
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {isEditMode ? "Edit Karyawan" : "Tambah Karyawan"}
              </h1>
              <p className="text-gray-600 dark:text-dark-400">
                {isEditMode
                  ? "Ubah data karyawan"
                  : "Lengkapi data karyawan baru"}
              </p>
            </div>
          </div>
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    getStepStatus(step) === "completed"
                      ? "bg-green-500 text-white"
                      : getStepStatus(step) === "current"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-dark-400"
                  }`}
                >
                  {getStepStatus(step) === "completed" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                    getStepStatus(step) === "current"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-dark-400"
                  }`}
                >
                  {step === 1 ? "Data Pribadi" : "Dokumen & Keamanan"}
                </span>
                {step < 2 && (
                  <div
                    className={`w-8 h-0.5 mx-4 transition-colors duration-300 ${
                      getStepStatus(step + 1) !== "upcoming"
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-dark-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 animate-in fade-in">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                    Informasi Pribadi
                  </h2>
                </div>

                {/* Foto Profil */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Foto Profil
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center transition-colors duration-300">
                      {files.foto ? (
                        <img
                          src={URL.createObjectURL(files.foto)}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400 dark:text-dark-500" />
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("foto-input")?.click()
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Upload Foto
                      </button>
                      <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                        Format: JPG, PNG, Maks: 2MB
                      </p>
                      <input
                        id="foto-input"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange("foto", file);
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.namaLengkap
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    />
                    {errors.namaLengkap && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">
                          {errors.namaLengkap}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* NIK (readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      NIK
                    </label>
                    <input
                      type="text"
                      name="nik"
                      value={
                        initialData?.nik ||
                        "(Akan diisi otomatis setelah simpan)"
                      }
                      readOnly
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600 cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contoh@email.com"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.email
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="nomorTelepon"
                      value={formData.nomorTelepon}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.nomorTelepon
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    />
                    {errors.nomorTelepon && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">
                          {errors.nomorTelepon}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalLahir"
                      value={formData.tanggalLahir}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.tanggalLahir
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    />
                    {errors.tanggalLahir && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">
                          {errors.tanggalLahir}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.jenisKelamin
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    {errors.jenisKelamin && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">
                          {errors.jenisKelamin}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Nomor Rekening */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      name="nomorRekening"
                      value={formData.nomorRekening}
                      onChange={handleInputChange}
                      placeholder="8937383784"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300"
                    />
                  </div>

                  {/* Dropdown Bank */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idBank"
                      value={formData.idBank}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 border-gray-300 dark:border-dark-600`}
                      required
                    >
                      <option value="">Pilih bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Dropdown Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idDepartment"
                      value={formData.idDepartment}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 border-gray-300 dark:border-dark-600`}
                      required
                    >
                      <option value="">Pilih department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Dropdown Shift */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Shift <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idShift"
                      value={formData.idShift}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 border-gray-300 dark:border-dark-600`}
                      required
                    >
                      <option value="">Pilih shift</option>
                      {shifts.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Dropdown Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Lokasi Kerja <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idLocation"
                      value={formData.idLocation}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 border-gray-300 dark:border-dark-600`}
                      required
                    >
                      <option value="">Pilih lokasi</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Alamat */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                      errors.alamat
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                  />
                  {errors.alamat && (
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.alamat}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Documents & Security */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300 animate-in fade-in">
                <div className="flex items-center space-x-2 mb-6">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                    Dokumen & Keamanan
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* KTP */}
                  <FileUpload
                    label="KTP *"
                    accept="application/pdf,image/jpeg,image/png"
                    maxSize="5MB"
                    formats="PDF, JPG, PNG"
                    onFileSelect={(file) => handleFileChange("ktp", file)}
                    value={files.ktp}
                  />

                  {/* NPWP */}
                  <FileUpload
                    label="NPWP"
                    accept="application/pdf,image/jpeg,image/png"
                    maxSize="5MB"
                    formats="PDF, JPG, PNG"
                    onFileSelect={(file) => handleFileChange("npwp", file)}
                    value={files.npwp}
                  />

                  {/* Ijazah Terakhir */}
                  <FileUpload
                    label="Ijazah Terakhir *"
                    accept="application/pdf,image/jpeg,image/png"
                    maxSize="5MB"
                    formats="PDF, JPG, PNG"
                    onFileSelect={(file) => handleFileChange("ijazah", file)}
                    value={files.ijazah}
                  />

                  {/* CV */}
                  <FileUpload
                    label="CV *"
                    accept="application/pdf"
                    maxSize="5MB"
                    formats="PDF"
                    onFileSelect={(file) => handleFileChange("cv", file)}
                    value={files.cv}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Masukkan username"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.username
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    />
                    {errors.username && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">
                          {errors.username}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Masukkan password"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
                        errors.password
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    />
                    {errors.password && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">
                          {errors.password}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 p-6 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
                  >
                    Sebelumnya
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Selanjutnya</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEmployeeForm;
