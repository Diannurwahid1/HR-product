import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
} from "lucide-react";
import { showSuccess, showError } from "../utils/alerts";
import FileUpload from "./FileUpload";

interface EditEmployeeFormProps {
  employeeId: number;
  onBack: () => void;
  onSuccess: () => void;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({
  employeeId,
  onBack,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<any>(null);
  const [files, setFiles] = useState<any>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Fetch employee detail
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/employee/detail?id=${employeeId}`);
        const data = await res.json();
        if (data.success) {
          setFormData({
            ...data.employee,
            tanggalLahir: data.employee.tanggalLahir?.slice(0, 10) || "",
            password: "", // Kosongkan password
          });
          setFiles({
            foto: data.employee.foto || null,
            ktp: data.employee.ktp || null,
            npwp: data.employee.npwp || null,
            ijazah: data.employee.ijazah || null,
            cv: data.employee.cv || null,
          });
        } else {
          showError(data.error || "Gagal mengambil data karyawan");
          onBack();
        }
      } catch (err) {
        showError("Gagal mengambil data karyawan");
        onBack();
      }
    };
    fetchDetail();
  }, [employeeId, onBack]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (fileType: string, file: File | null) => {
    setFiles((prev: any) => ({ ...prev, [fileType]: file }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.namaLengkap?.trim())
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    if (!formData.email?.trim()) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid";
    if (!formData.nomorTelepon?.trim())
      newErrors.nomorTelepon = "Nomor telepon wajib diisi";
    if (!formData.tanggalLahir)
      newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!formData.jenisKelamin)
      newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!formData.alamat?.trim()) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.username?.trim()) newErrors.username = "Username wajib diisi";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const payload: any = {
        ...formData,
        id: employeeId,
        foto: typeof files.foto === "string" ? files.foto : null,
        ktp: typeof files.ktp === "string" ? files.ktp : null,
        npwp: typeof files.npwp === "string" ? files.npwp : null,
        ijazah: typeof files.ijazah === "string" ? files.ijazah : null,
        cv: typeof files.cv === "string" ? files.cv : null,
      };
      // Format tanggalLahir ke ISO string jika hanya YYYY-MM-DD
      if (payload.tanggalLahir && payload.tanggalLahir.length === 10) {
        payload.tanggalLahir = new Date(payload.tanggalLahir).toISOString();
      }
      if (!payload.password) delete payload.password;
      delete payload.createdAt;
      delete payload.updatedAt;
      const res = await fetch("/api/employee/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Data karyawan berhasil diupdate!");
        onSuccess();
      } else {
        showError(data.error || "Gagal update data karyawan");
      }
    } catch (err) {
      showError("Gagal update data karyawan");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const getStepStatus = (step: number) =>
    step < currentStep
      ? "completed"
      : step === currentStep
      ? "current"
      : "upcoming";

  if (!formData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
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
                Edit Karyawan
              </h1>
              <p className="text-gray-600 dark:text-dark-400">
                Perbarui data karyawan
              </p>
            </div>
          </div>
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
                    {typeof files.foto === "string" && files.foto && (
                      <img
                        src={files.foto}
                        alt="Foto Profil"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <FileUpload
                      label="Upload Foto"
                      accept="image/jpeg,image/png"
                      maxSize="2MB"
                      formats="JPG, PNG"
                      onFileSelect={(file) => handleFileChange("foto", file)}
                      value={files.foto}
                    />
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
                        formData.nik || "(Akan diisi otomatis setelah simpan)"
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
                      disabled
                      onChange={handleInputChange}
                      placeholder="contoh@email.com"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
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
                      value={formData.nomorRekening || ""}
                      onChange={handleInputChange}
                      placeholder="8937383784"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300"
                    />
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
                      disabled
                      onChange={handleInputChange}
                      placeholder="Masukkan username"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100 transition-all duration-300 ${
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
                      Password (Opsional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Kosongkan jika tidak ingin mengubah password"
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
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <span>Batal</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEmployeeForm;
