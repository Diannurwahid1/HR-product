import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X, FileText, Upload, Calendar } from "lucide-react";
import { showSuccess, showConfirm } from "../utils/alerts";
import FileUpload from "./FileUpload";

interface AddContractFormProps {
  onBack: () => void;
  onSave: (contractData: any) => void;
  initialData?: any;
  isEditMode?: boolean;
  extendMode?: boolean;
}

const AddContractForm: React.FC<AddContractFormProps> = ({
  onBack,
  onSave,
  initialData,
  isEditMode,
  extendMode,
}) => {
  const [formData, setFormData] = useState({
    idEmployee: "",
    idDepartment: "",
    idShift: "",
    idLocation: "",
    posisiJabatan: "",
    atasanLangsung: "",
    jenisKontrak: "PKWT",
    tanggalMulai: "",
    tanggalBerakhir: "",
    durasiKontrak: "",
    periodeReview: "",
    gajiPokok: "",
    tunjangan: "",
    uangMakan: "",
    uangTransport: "",
    templateKontrak: "",
    uploadDokumen: null as File | null,
    catatan: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  type Department = { id: string; name: string };
  type Shift = { id: string; name: string };
  type Location = { id: string; name: string };
  type Employee = { id: string; namaLengkap: string };
  type JobPosition = { id: string; name: string };
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [showCustomPosition, setShowCustomPosition] = useState(false);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [deptRes, shiftRes, locRes, empRes, jobPosRes] =
          await Promise.all([
            fetch("/api/master/department/list").then((r) => r.json()),
            fetch("/api/master/shift/list").then((r) => r.json()),
            fetch("/api/master/location/list").then((r) => r.json()),
            fetch("/api/employee/list").then((r) => r.json()),
            fetch("/api/master/job-position/list").then((r) => r.json()),
          ]);
        setDepartments(deptRes.departments || []);
        setShifts(shiftRes.shifts || []);
        setLocations(locRes.locations || []);
        setEmployees(empRes.employees || []);
        setJobPositions(jobPosRes.jobPositions || []);
      } catch {}
    };
    fetchMasters();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        idEmployee: initialData.employeeId || initialData.idEmployee || "",
        idDepartment:
          initialData.department?.id ||
          initialData.departemen ||
          initialData.idDepartment ||
          "",
        idShift: initialData.idShift || "",
        idLocation: initialData.idLocation || "",
        posisiJabatan:
          initialData.posisiJabatan || initialData.jobPosition?.name || "",
        atasanLangsung: initialData.atasanLangsung || "",
        jenisKontrak: initialData.jenisKontrak || "PKWT",
        tanggalMulai: initialData.tanggalMulai
          ? initialData.tanggalMulai.slice(0, 10)
          : "",
        tanggalBerakhir: initialData.tanggalBerakhir
          ? initialData.tanggalBerakhir.slice(0, 10)
          : "",
        durasiKontrak: initialData.durasiKontrak || "",
        periodeReview: initialData.periodeReview || "",
        gajiPokok: initialData.gajiPokok ? String(initialData.gajiPokok) : "",
        tunjangan: initialData.tunjangan ? String(initialData.tunjangan) : "",
        uangMakan: initialData.uangMakan ? String(initialData.uangMakan) : "",
        uangTransport: initialData.uangTransport
          ? String(initialData.uangTransport)
          : "",
        templateKontrak: initialData.templateKontrak || "",
        uploadDokumen: null,
        catatan: initialData.catatan || "",
      });
    }
  }, [initialData]);

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

    // Auto calculate duration when dates are selected
    if (name === "tanggalMulai" || name === "tanggalBerakhir") {
      if (formData.tanggalMulai && formData.tanggalBerakhir) {
        const startDate = new Date(
          name === "tanggalMulai" ? value : formData.tanggalMulai
        );
        const endDate = new Date(
          name === "tanggalBerakhir" ? value : formData.tanggalBerakhir
        );
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);

        setFormData((prev) => ({
          ...prev,
          durasiKontrak: `${months} bulan`,
        }));
      }
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      uploadDokumen: file,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.idEmployee) {
      newErrors.idEmployee = "Pilih karyawan wajib diisi";
    }

    if (!formData.idDepartment) {
      newErrors.idDepartment = "Departemen wajib diisi";
    }

    if (!formData.posisiJabatan) {
      newErrors.posisiJabatan = "Posisi/Jabatan wajib diisi";
    }

    if (!formData.tanggalMulai) {
      newErrors.tanggalMulai = "Tanggal mulai wajib diisi";
    }

    if (!formData.tanggalBerakhir) {
      newErrors.tanggalBerakhir = "Tanggal berakhir wajib diisi";
    }

    if (!formData.gajiPokok) {
      newErrors.gajiPokok = "Gaji pokok wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload: any = {
      employeeId: formData.idEmployee,
      departemen: formData.idDepartment,
      posisiJabatan: formData.posisiJabatan,
      atasanLangsung: formData.atasanLangsung,
      jenisKontrak: formData.jenisKontrak,
      tanggalMulai: formData.tanggalMulai,
      tanggalBerakhir: formData.tanggalBerakhir,
      durasiKontrak: formData.durasiKontrak,
      periodeReview: formData.periodeReview,
      gajiPokok: formData.gajiPokok,
      tunjangan: formData.tunjangan,
      uangMakan: formData.uangMakan,
      uangTransport: formData.uangTransport,
      templateKontrak: formData.templateKontrak,
      catatan: formData.catatan,
    };
    if (isEditMode && initialData?.id) {
      payload["id"] = initialData.id;
    }
    try {
      const res = await fetch(
        isEditMode ? "/api/contract/update" : "/api/contract/add",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess(
          isEditMode
            ? "Kontrak berhasil diupdate!"
            : "Kontrak berhasil disimpan!"
        );
        onSave(data.contract);
        onBack();
      } else {
        showConfirm(
          data.error ||
            (isEditMode ? "Gagal update kontrak" : "Gagal menyimpan kontrak")
        );
      }
    } catch {
      showConfirm(
        isEditMode ? "Gagal update kontrak" : "Gagal menyimpan kontrak"
      );
    }
  };

  const handleSaveDraft = () => {
    showSuccess("Draft kontrak berhasil disimpan!");
  };

  const handleCancel = async () => {
    const confirmed = await showConfirm(
      "Apakah Anda yakin ingin membatalkan? Data yang sudah diisi akan hilang."
    );
    if (confirmed) {
      onBack();
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    return new Intl.NumberFormat("id-ID").format(parseInt(number) || 0);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^\d]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tambah Kontrak
              </h1>
              <p className="text-gray-600">Kontrak Kerja • Tambah Kontrak</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informasi Kontrak Baru */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Informasi Kontrak Baru
              </h2>

              {/* Informasi Karyawan */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-4">
                  Informasi Karyawan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pilih Karyawan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Karyawan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idEmployee"
                      value={formData.idEmployee}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.idEmployee ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Pilih karyawan</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.namaLengkap}
                        </option>
                      ))}
                    </select>
                    {errors.idEmployee && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.idEmployee}
                      </p>
                    )}
                  </div>

                  {/* Departemen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departemen
                    </label>
                    <select
                      name="idDepartment"
                      value={formData.idDepartment}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.idDepartment
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Pilih department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.idDepartment && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.idDepartment}
                      </p>
                    )}
                  </div>

                  {/* Posisi/Jabatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posisi/Jabatan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="posisiJabatan"
                      value={
                        showCustomPosition ? "lainnya" : formData.posisiJabatan
                      }
                      onChange={(e) => {
                        if (e.target.value === "lainnya") {
                          setShowCustomPosition(true);
                          setFormData((prev) => ({
                            ...prev,
                            posisiJabatan: "",
                          }));
                        } else {
                          setShowCustomPosition(false);
                          setFormData((prev) => ({
                            ...prev,
                            posisiJabatan: e.target.value,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.posisiJabatan
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Pilih posisi/jabatan</option>
                      {jobPositions.map((pos) => (
                        <option key={pos.id} value={pos.name}>
                          {pos.name}
                        </option>
                      ))}
                      <option value="lainnya">Lainnya (isi manual)</option>
                    </select>
                    {showCustomPosition && (
                      <input
                        type="text"
                        name="posisiJabatan"
                        value={formData.posisiJabatan}
                        onChange={handleInputChange}
                        placeholder="Masukkan posisi/jabatan"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 ${
                          errors.posisiJabatan
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                    {errors.posisiJabatan && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.posisiJabatan}
                      </p>
                    )}
                  </div>

                  {/* Atasan Langsung */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atasan Langsung
                    </label>
                    <input
                      type="text"
                      name="atasanLangsung"
                      value={formData.atasanLangsung}
                      onChange={handleInputChange}
                      placeholder="Masukkan Atasan karyawan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Kontrak */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-4">
                  Detail Kontrak
                </h3>

                {/* Jenis Kontrak */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kontrak <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jenisKontrak"
                        value="PKWT"
                        checked={formData.jenisKontrak === "PKWT"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      PKWT (Kontrak)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jenisKontrak"
                        value="PKWTT"
                        checked={formData.jenisKontrak === "PKWTT"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      PKWTT (Tetap)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tanggal Mulai */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalMulai"
                      value={formData.tanggalMulai}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.tanggalMulai
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.tanggalMulai && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tanggalMulai}
                      </p>
                    )}
                  </div>

                  {/* Tanggal Berakhir */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Berakhir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggalBerakhir"
                      value={formData.tanggalBerakhir}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.tanggalBerakhir
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.tanggalBerakhir && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tanggalBerakhir}
                      </p>
                    )}
                  </div>

                  {/* Durasi Kontrak */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi Kontrak
                    </label>
                    <input
                      type="text"
                      name="durasiKontrak"
                      value={formData.durasiKontrak}
                      onChange={handleInputChange}
                      placeholder="12 bulan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>

                  {/* Periode Review */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Periode Review
                    </label>
                    <select
                      name="periodeReview"
                      value={formData.periodeReview}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih periode review</option>
                      <option value="3 bulan">3 bulan</option>
                      <option value="6 bulan">6 bulan</option>
                      <option value="12 bulan">12 bulan</option>
                    </select>
                  </div>

                  {/* Gaji Pokok */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gaji Pokok <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="gajiPokok"
                        value={formatCurrency(formData.gajiPokok)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.gajiPokok
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.gajiPokok && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gajiPokok}
                      </p>
                    )}
                  </div>

                  {/* Tunjangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tunjangan
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="tunjangan"
                        value={formatCurrency(formData.tunjangan)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Uang Makan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uang Makan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="uangMakan"
                        value={formatCurrency(formData.uangMakan)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Uang Transport */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Uang Transport
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                      <input
                        type="text"
                        name="uangTransport"
                        value={formatCurrency(formData.uangTransport)}
                        onChange={handleCurrencyChange}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dokumen Kontrak */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-800 mb-4">
                  Dokumen Kontrak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Template Kontrak */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Kontrak
                    </label>
                    <select
                      name="templateKontrak"
                      value={formData.templateKontrak}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih template</option>
                      <option value="Template PKWT Standard">
                        Template PKWT Standard
                      </option>
                      <option value="Template PKWTT Standard">
                        Template PKWTT Standard
                      </option>
                      <option value="Template Manager">Template Manager</option>
                      <option value="Template Internship">
                        Template Internship
                      </option>
                    </select>
                  </div>

                  {/* Upload Dokumen */}
                  <div>
                    <FileUpload
                      label="Upload Dokumen"
                      accept="application/pdf,.doc,.docx"
                      maxSize="5MB"
                      formats="PDF, DOC, DOCX"
                      onFileSelect={handleFileChange}
                      value={formData.uploadDokumen}
                    />
                  </div>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Tambahkan catatan atau informasi tambahan tentang kontrak ini..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-lg p-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Simpan Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? "Simpan Perubahan" : "Tambah Kontrak"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddContractForm;
