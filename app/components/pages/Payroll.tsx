import React, { useEffect, useState } from "react";
import { Plus, Eye, FileText, Calculator, Download } from "lucide-react";
import { showSuccess, showError } from "../../utils/alerts";
import Script from "next/script";

// Function to convert numbers to Indonesian words
const terbilang = (num: number): string => {
  if (num === 0) return "nol";

  const units = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];
  const convertLessThanOneThousand = (n: number): string => {
    if (n < 12) return units[n];
    if (n < 20) return units[n % 10] + " belas";
    if (n < 100) return units[Math.floor(n / 10)] + " puluh " + units[n % 10];
    return (
      units[Math.floor(n / 100)] +
      " ratus " +
      convertLessThanOneThousand(n % 100)
    );
  };

  let result = "";
  let remainder = num;

  // Handle trillions (trilyun)
  if (remainder >= 1000000000000) {
    result +=
      convertLessThanOneThousand(Math.floor(remainder / 1000000000000)) +
      " trilyun ";
    remainder %= 1000000000000;
  }

  // Handle billions (milyar)
  if (remainder >= 1000000000) {
    result +=
      convertLessThanOneThousand(Math.floor(remainder / 1000000000)) +
      " milyar ";
    remainder %= 1000000000;
  }

  // Handle millions (juta)
  if (remainder >= 1000000) {
    result +=
      convertLessThanOneThousand(Math.floor(remainder / 1000000)) + " juta ";
    remainder %= 1000000;
  }

  // Handle thousands (ribu)
  if (remainder >= 1000) {
    if (Math.floor(remainder / 1000) === 1) {
      result += "seribu ";
    } else {
      result +=
        convertLessThanOneThousand(Math.floor(remainder / 1000)) + " ribu ";
    }
    remainder %= 1000;
  }

  // Handle the rest
  if (remainder > 0) {
    result += convertLessThanOneThousand(remainder);
  }

  return result.trim();
};

const PayrollPage: React.FC = () => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [showSlip, setShowSlip] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({
    employeeId: "",
    periodeBulan: "",
    periodeTahun: "",
    components: [{ nama: "", tipe: "gaji_pokok", nominal: "", keterangan: "" }],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchPeriode, setBatchPeriode] = useState({ bulan: "", tahun: "" });
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<any[]>([]);
  const [komponenGaji, setKomponenGaji] = useState<any[]>([]);
  const [showMasterKomponen, setShowMasterKomponen] = useState(false);
  const [selectedMasterKomponen, setSelectedMasterKomponen] = useState<
    string[]
  >([]);
  const [searchMasterKomponen, setSearchMasterKomponen] = useState("");
  const [supervisor, setSupervisor] = useState<string>("");
  const [masterGaji, setMasterGaji] = useState<any[]>([]);

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
    fetchKomponenGaji();
    fetchMasterGaji();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employee/list");
      const data = await res.json();
      if (data.success) setEmployees(data.employees);
    } catch {}
  };

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payroll/list");
      const data = await res.json();
      if (data.success) setPayrolls(data.payrolls);
    } finally {
      setLoading(false);
    }
  };

  const fetchKomponenGaji = async () => {
    try {
      const res = await fetch("/api/master-komponen-gaji/list?status=Aktif");
      const data = await res.json();
      if (data.success) setKomponenGaji(data.komponen);
    } catch {}
  };

  const fetchMasterGaji = async () => {
    try {
      const res = await fetch("/api/master-gaji/list");
      const data = await res.json();
      if (data.success) setMasterGaji(data.masterGaji);
    } catch {}
  };

  const handleShowDetail = (payroll: any) => {
    setSelectedPayroll(payroll);
    setShowDetailModal(true);
  };
  const handleShowSlip = async (payroll: any) => {
    setSelectedPayroll(payroll);
    setShowSlip(true);
    setSupervisor("");
    // Fetch contract for this employee
    try {
      const res = await fetch(`/api/contract/list`);
      const data = await res.json();
      if (data.success && Array.isArray(data.contracts)) {
        // Cari kontrak aktif (atau kontrak terakhir) untuk employeeId
        const kontrak = data.contracts.find((c: any) => c.employeeId === payroll.employeeId);
        if (kontrak && kontrak.atasanLangsung) {
          setSupervisor(kontrak.atasanLangsung);
        }
      }
    } catch {}
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedPayroll(null);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
  };
  const closeSlip = () => {
    setShowSlip(false);
    setSelectedPayroll(null);
    setPrintMode(false);
    setShowPrintView(false);
  };

  const handlePrintSlip = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 300);
  };

  const openPrintView = () => {
    setShowPrintView(true);
    setShowSlip(false);
  };

  const printSlipFromView = () => {
    // Set a small delay to ensure the content is fully rendered
    setTimeout(() => {
      setPrintMode(true);
      setTimeout(() => {
        window.print();
        setPrintMode(false);
      }, 300);
    }, 500);
  };

  // Completely rewritten PDF export functionality
  const exportToPdf = () => {
    // Show loading message
    showSuccess("Generating PDF...");

    // Always switch to print view first
    if (!showPrintView) {
      setShowPrintView(true);
      
      // Add a longer delay to ensure the print view is fully rendered
      setTimeout(() => {
        console.log("Starting PDF export after delay");
        generatePdf();
      }, 2000);
    } else {
      generatePdf();
    }
  };

  const generatePdf = () => {
    try {
      console.log("Attempting to find printable content");
      
      // Try multiple selectors to find the content
      let element = document.getElementById("slip-content-export");
      console.log("Element by ID:", element ? "Found" : "Not found");
      
      if (!element) {
        const alternativeSelectors = [
          ".max-w-4xl.mx-auto.bg-white",
          ".max-w-4xl",
          ".bg-white.border.border-gray-200",
          "#slip-content",
          ".bg-white"
        ];
        
        for (const selector of alternativeSelectors) {
          element = document.querySelector(selector);
          if (element) {
            console.log(`Found element using selector: ${selector}`);
            break;
          }
        }
      }
      
      if (!element) {
        // Log all available elements with IDs for debugging
        const allElements = document.querySelectorAll("[id]");
        console.log("Available elements with IDs:", Array.from(allElements).map(el => el.id));
        
        // Log all elements with specific classes
        console.log("Elements with max-w-4xl class:", document.querySelectorAll(".max-w-4xl").length);
        console.log("Elements with bg-white class:", document.querySelectorAll(".bg-white").length);
        
        console.error("No suitable element found for PDF export");
        showError("Could not find content to export. Please try again.");
        return;
      }
      
      console.log("Found element for export:", element);

      // Use html2pdf.js to generate the PDF
      // @ts-ignore - html2pdf is loaded from CDN
      const html2pdf = window.html2pdf;

      if (!html2pdf) {
        console.error("html2pdf library not loaded");
        showError("PDF generation library not loaded. Please refresh the page and try again.");
        return;
      }

      // Enhanced PDF export options for better quality
      const opt = {
        margin: 10,
        filename: `Slip_Gaji_${
          selectedPayroll?.employee?.namaLengkap || "Karyawan"
        }_${selectedPayroll?.periodeBulan || ""}_${
          selectedPayroll?.periodeTahun || ""
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          removeContainer: false
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait",
          compress: true,
          precision: 16
        },
      };

      console.log("Starting PDF generation with options:", opt);
      
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        // @ts-ignore - html2pdf method chain returns a promise
        .then(() => {
          console.log("PDF generated successfully");
          showSuccess("PDF generated successfully!");
        })
        .catch((error: any) => {
          console.error("Error generating PDF:", error);
          showError("Failed to generate PDF: " + (error.message || "Unknown error"));
        });
    } catch (error: any) {
      console.error("Error in generatePdf:", error);
      showError("An error occurred during PDF export: " + (error.message || "Unknown error"));
    }
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleComponentChange = (idx: number, e: any) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const comps = [...prev.components];
      // Use type assertion to fix TypeScript error
      (comps[idx] as any)[name] = value;
      return { ...prev, components: comps };
    });
  };
  const addComponent = () => {
    setForm((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        { nama: "", tipe: "tunjangan", nominal: "", keterangan: "" },
      ],
    }));
  };
  const removeComponent = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== idx),
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError("");
    // Validasi frontend
    if (!form.employeeId || !form.periodeBulan || !form.periodeTahun) {
      setFormError("Semua field wajib diisi.");
      return;
    }
    if (!form.components.length) {
      setFormError("Minimal 1 komponen gaji/potongan.");
      return;
    }
    for (const c of form.components) {
      if (!c.nama || !c.tipe || c.nominal === undefined || c.nominal === "") {
        setFormError("Semua field komponen wajib diisi.");
        return;
      }
      if (isNaN(Number(c.nominal)) || Number(c.nominal) <= 0) {
        setFormError(`Nominal komponen '${c.nama}' harus lebih dari 0.`);
        return;
      }
      if (!["gaji_pokok", "tunjangan", "potongan"].includes(c.tipe)) {
        setFormError(`Tipe komponen '${c.nama}' tidak valid.`);
        return;
      }
    }
    setFormLoading(true);
    try {
      const res = await fetch("/api/payroll/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: form.employeeId,
          periodeBulan: Number(form.periodeBulan),
          periodeTahun: Number(form.periodeTahun),
          components: form.components,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess("Payroll berhasil dibuat!");
        setShowModal(false);
        setForm({
          employeeId: "",
          periodeBulan: "",
          periodeTahun: "",
          components: [
            { nama: "", tipe: "gaji_pokok", nominal: "", keterangan: "" },
          ],
        });
        fetchPayrolls();
      } else {
        setFormError(data.error || "Gagal generate payroll");
      }
    } catch {
      setFormError("Gagal generate payroll");
    } finally {
      setFormLoading(false);
    }
  };

  const handleBatchSubmit = async (e: any) => {
    e.preventDefault();
    setBatchLoading(true);
    setBatchResult([]);
    try {
      // Mapping employeeId ke nominal gaji pokok
      const gajiMap: Record<string, number> = {};
      masterGaji.forEach((g: any) => {
        if (g.status === "Aktif") gajiMap[g.employeeId] = g.nominal;
      });
      const results: any[] = [];
      let successCount = 0;
      let skippedCount = 0;
      for (const emp of employees) {
        if (emp.status !== "Aktif") continue;
        const baseSalary = gajiMap[emp.id] || 0;
        if (baseSalary <= 0) {
          results.push({
            nama: emp.namaLengkap,
            nik: emp.nik,
            success: false,
            error: "Gaji pokok tidak ditemukan atau 0",
          });
          skippedCount++;
          continue;
        }
        const res = await fetch("/api/payroll/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: emp.id,
            periodeBulan: Number(batchPeriode.bulan),
            periodeTahun: Number(batchPeriode.tahun),
            components: [
              {
                nama: "Gaji Pokok",
                tipe: "gaji_pokok",
                nominal: baseSalary,
                keterangan: "",
              },
            ],
          }),
        });
        const data = await res.json();
        if (data.success) successCount++;
        results.push({
          nama: emp.namaLengkap,
          nik: emp.nik,
          success: data.success,
          error: data.error,
        });
      }
      setBatchResult(results);
      fetchPayrolls();
      if (results.length > 0 && successCount === 0) {
        showError("Semua payroll gagal diproses. Cek data gaji pokok karyawan.");
      } else if (successCount > 0) {
        showSuccess(`Payroll berhasil diproses untuk ${successCount} karyawan. ${skippedCount > 0 ? skippedCount + ' karyawan tidak diproses karena tidak ada gaji pokok.' : ''}`);
      }
    } finally {
      setBatchLoading(false);
    }
  };

  // Tambahkan handler untuk mengisi komponen dari master
  const handleFillFromMaster = () => {
    setForm((prev) => ({
      ...prev,
      components: komponenGaji.map((k: any) => ({
        nama: k.nama,
        tipe: k.tipe,
        nominal: k.defaultNominal,
        keterangan: k.keterangan || "",
      })),
    }));
  };

  // Handler buka modal pilih master
  const openMasterKomponen = () => {
    setSelectedMasterKomponen([]);
    setShowMasterKomponen(true);
  };
  // Handler toggle checkbox
  const toggleMasterKomponen = (id: string) => {
    setSelectedMasterKomponen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  // Handler tambahkan ke form
  const addSelectedKomponen = () => {
    const toAdd = komponenGaji.filter((k) =>
      selectedMasterKomponen.includes(k.id)
    );
    setForm((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        ...toAdd.filter((k) => !prev.components.some((c) => c.nama === k.nama)),
      ].map((k) => ({
        nama: k.nama,
        tipe: k.tipe,
        nominal: k.defaultNominal,
        keterangan: k.keterangan || "",
      })),
    }));
    setShowMasterKomponen(false);
  };

  // Filter komponen master sesuai search
  const filteredKomponenGaji = komponenGaji.filter((k) => {
    const q = searchMasterKomponen.toLowerCase();
    return (
      k.nama.toLowerCase().includes(q) ||
      k.tipe.toLowerCase().includes(q) ||
      (k.keterangan || "").toLowerCase().includes(q)
    );
  });

  // Handler select all
  const allFilteredIds = filteredKomponenGaji.map((k) => k.id);
  const isAllSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedMasterKomponen.includes(id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMasterKomponen((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id))
      );
    } else {
      setSelectedMasterKomponen((prev) =>
        Array.from(new Set([...prev, ...allFilteredIds]))
      );
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-dark-900 min-h-screen transition-colors duration-300">
      {/* Load html2pdf.js from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="lazyOnload"
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
          Payroll
        </h1>
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Generate Payroll</span>
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors duration-200"
            onClick={() => setShowBatchModal(true)}
          >
            <Calculator className="w-4 h-4" />
            <span>Generate Payroll Massal</span>
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow p-6 transition-colors duration-300">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Nama Karyawan
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Periode
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Total Gaji
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Status
              </th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
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
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : payrolls.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500 dark:text-dark-400"
                >
                  Belum ada data payroll
                </td>
              </tr>
            ) : (
              payrolls.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 dark:border-dark-700"
                >
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {p.employee?.namaLengkap}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {p.periodeBulan}/{p.periodeTahun}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900 dark:text-dark-100">
                    Rp {p.totalGaji.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-dark-100">
                    {p.status}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => handleShowDetail(p)}
                    >
                      <Eye className="inline w-4 h-4 mr-1" /> Detail
                    </button>
                    <button
                      className="text-green-600 dark:text-green-400 hover:underline"
                      onClick={() => handleShowSlip(p)}
                    >
                      <FileText className="inline w-4 h-4 mr-1" /> Slip
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Generate Payroll */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300" onClick={closeModal}>
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-2xl relative transition-colors duration-300 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">
              Generate Payroll
            </h2>
            {formError && (
              <div className="mb-3 text-red-600 dark:text-red-400 text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                  Karyawan
                </label>
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
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
                    Bulan
                  </label>
                  <input
                    type="number"
                    name="periodeBulan"
                    min={1}
                    max={12}
                    value={form.periodeBulan}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    placeholder="1-12"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Tahun
                  </label>
                  <input
                    type="number"
                    name="periodeTahun"
                    min={2020}
                    max={2100}
                    value={form.periodeTahun}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                  Komponen Gaji/Potongan
                </label>
                {form.components.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-end md:space-x-2 mb-4 p-3 rounded-lg border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 transition-colors duration-300 relative group"
                  >
                    <div className="flex-1 mb-2 md:mb-0">
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-dark-200">
                        Nama Komponen
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={c.nama}
                        onChange={(e) => handleComponentChange(idx, e)}
                        placeholder="Contoh: Gaji Pokok, Tunjangan Transport"
                        className="border rounded px-2 py-1 w-full bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600 min-w-0 focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div className="w-full md:w-32 mb-2 md:mb-0">
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-dark-200">
                        Tipe
                      </label>
                      <select
                        name="tipe"
                        value={c.tipe}
                        onChange={(e) => handleComponentChange(idx, e)}
                        className="border rounded px-2 py-1 w-full bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600 min-w-0 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="gaji_pokok">Gaji Pokok</option>
                        <option value="tunjangan">Tunjangan</option>
                        <option value="potongan">Potongan</option>
                      </select>
                    </div>
                    <div className="w-full md:w-24 mb-2 md:mb-0">
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-dark-200">
                        Nominal
                      </label>
                      <input
                        type="number"
                        name="nominal"
                        value={c.nominal}
                        onChange={(e) => handleComponentChange(idx, e)}
                        placeholder="0"
                        className="border rounded px-2 py-1 w-full bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600 min-w-0 focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-dark-200">
                        Keterangan
                      </label>
                      <input
                        type="text"
                        name="keterangan"
                        value={c.keterangan}
                        onChange={(e) => handleComponentChange(idx, e)}
                        placeholder="Opsional, contoh: Bulan Januari"
                        className="border rounded px-2 py-1 w-full bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600 min-w-0 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeComponent(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 text-lg font-bold p-1 rounded transition-colors duration-200 bg-white dark:bg-dark-800 shadow group-hover:bg-red-50 dark:group-hover:bg-red-900/30"
                      aria-label="Hapus komponen"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addComponent}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-1"
                >
                  + Tambah Komponen
                </button>
                <button
                  type="button"
                  onClick={openMasterKomponen}
                  className="ml-4 text-green-600 dark:text-green-400 hover:underline text-sm mt-1"
                >
                  Pilih dari master
                </button>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  disabled={formLoading}
                >
                  {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Pilih Komponen Master */}
      {showMasterKomponen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300" onClick={closeModal}>
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-2xl relative transition-colors duration-300 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200"
              onClick={() => setShowMasterKomponen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">Pilih Komponen dari Master</h2>
            <input
              type="text"
              placeholder="Cari komponen..."
              value={searchMasterKomponen}
              onChange={e => setSearchMasterKomponen(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded dark:bg-dark-900 dark:text-dark-100"
            />
            <div className="mb-2 flex items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                id="select-all-komponen"
                className="mr-2"
              />
              <label htmlFor="select-all-komponen" className="text-gray-700 dark:text-dark-200 cursor-pointer">
                Pilih Semua
              </label>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded mb-4">
              {filteredKomponenGaji.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">Tidak ada komponen ditemukan</div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Checklist</th>
                      <th className="px-2 py-1 text-left">Nama</th>
                      <th className="px-2 py-1 text-left">Tipe</th>
                      <th className="px-2 py-1 text-left">Nominal Default</th>
                      <th className="px-2 py-1 text-left">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKomponenGaji.map((k) => (
                      <tr key={k.id}>
                        <td className="px-2 py-1">
                          <input
                            type="checkbox"
                            checked={selectedMasterKomponen.includes(k.id)}
                            onChange={() => toggleMasterKomponen(k.id)}
                          />
                        </td>
                        <td className="px-2 py-1">{k.nama}</td>
                        <td className="px-2 py-1">{k.tipe}</td>
                        <td className="px-2 py-1">{k.defaultNominal}</td>
                        <td className="px-2 py-1">{k.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 dark:bg-dark-700 text-gray-800 dark:text-dark-100 hover:bg-gray-400 dark:hover:bg-dark-600"
                onClick={() => setShowMasterKomponen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                onClick={addSelectedKomponen}
                disabled={selectedMasterKomponen.length === 0}
              >
                Tambahkan ke Form
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Detail Payroll */}
      {showDetailModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300" onClick={closeModal}>
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-2xl relative transition-colors duration-300 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200"
              onClick={() => setShowDetailModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">
              Detail Payroll
            </h2>
            <div className="mb-2 text-gray-800 dark:text-dark-200">
              Nama: <b>{selectedPayroll.employee?.namaLengkap}</b>
            </div>
            <div className="mb-2 text-gray-800 dark:text-dark-200">
              Periode: <b>{selectedPayroll.periodeBulan}/{selectedPayroll.periodeTahun}</b>
            </div>
            <div className="mb-2 text-gray-800 dark:text-dark-200">
              Status: <b>{selectedPayroll.status}</b>
            </div>
            <div className="mb-2 text-gray-800 dark:text-dark-200">
              Total Gaji: <b>Rp {selectedPayroll.totalGaji.toLocaleString()}</b>
            </div>
            <div className="mb-2 text-gray-800 dark:text-dark-200">
              Komponen:
            </div>
            <ul className="list-disc ml-6 text-gray-800 dark:text-dark-200">
              {selectedPayroll.components?.map((c: any) => (
                <li key={c.id}>
                  {c.nama} ({c.tipe}): Rp {c.nominal.toLocaleString()} {c.keterangan && <span>- {c.keterangan}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* Modal Slip Gaji */}
      {showSlip && selectedPayroll && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300 ${
            printMode ? "print:bg-white print:bg-opacity-100" : ""
          }`}
          onClick={closeSlip}
        >
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-2xl relative transition-colors duration-300 print:shadow-none print:max-w-full print:p-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-6 print:mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-100">
                Slip Gaji
              </h2>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition-colors duration-200 print:hidden mr-2"
                  onClick={exportToPdf}
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  className="text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200 print:hidden"
                  onClick={closeSlip}
                >
                  &times;
                </button>
              </div>
            </div>

            <div
              id="slip-content"
              className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 mb-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Nama Karyawan
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {selectedPayroll.employee?.namaLengkap}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    NIK
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {selectedPayroll.employee?.nik || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Jabatan
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {selectedPayroll.employee?.jobPosition?.nama || selectedPayroll.employee?.jobPosition || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Departemen
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {selectedPayroll.employee?.department?.nama || selectedPayroll.employee?.department || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Periode
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {selectedPayroll.periodeBulan}/{selectedPayroll.periodeTahun}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Status
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {selectedPayroll.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    Tanggal Cetak
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-dark-100">
                    {new Date().toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-dark-100 mb-3">
              Rincian Gaji
            </h3>

            <table className="min-w-full mb-6 border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-700">
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200 border border-gray-200 dark:border-dark-600">
                    Komponen
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200 border border-gray-200 dark:border-dark-600">
                    Nominal
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-dark-200 border border-gray-200 dark:border-dark-600">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedPayroll.components?.map((c: any) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 border border-gray-200 dark:border-dark-600">
                      {c.nama} ({c.tipe})
                    </td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-dark-600">
                      Rp {c.nominal.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-dark-600">
                      {c.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold text-lg text-gray-900 dark:text-dark-100">
              Total: Rp {selectedPayroll.totalGaji.toLocaleString()}
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-dark-400">
              Terbilang: <i>{terbilang(selectedPayroll.totalGaji)} rupiah</i>
            </div>
            {/* Pengesahan Atasan */}
            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="mb-12">Mengetahui/Pengesahan,<br />Atasan Langsung</div>
                <div style={{ minHeight: 40 }} />
                <div className="font-semibold underline">{supervisor || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* HIDDEN SLIP FOR EXPORT PDF */}
      {showSlip && selectedPayroll && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', background: '#fff', zIndex: -1 }}>
          <div id="slip-content-export" className="border border-gray-200 rounded-lg p-4 mb-6 bg-white" style={{ color: '#222' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Nama Karyawan</p>
                <p className="font-semibold">{selectedPayroll.employee?.namaLengkap}</p>
              </div>
              <div>
                <p className="text-sm">NIK</p>
                <p className="font-semibold">{selectedPayroll.employee?.nik || '-'}</p>
              </div>
              <div>
                <p className="text-sm">Jabatan</p>
                <p className="font-semibold">{selectedPayroll.employee?.jobPosition?.nama || selectedPayroll.employee?.jobPosition || '-'}</p>
              </div>
              <div>
                <p className="text-sm">Departemen</p>
                <p className="font-semibold">{selectedPayroll.employee?.department?.nama || selectedPayroll.employee?.department || '-'}</p>
              </div>
              <div>
                <p className="text-sm">Periode</p>
                <p className="font-semibold">{selectedPayroll.periodeBulan}/{selectedPayroll.periodeTahun}</p>
              </div>
              <div>
                <p className="text-sm">Status</p>
                <p className="font-semibold">{selectedPayroll.status}</p>
              </div>
              <div>
                <p className="text-sm">Tanggal Cetak</p>
                <p className="font-semibold">{new Date().toLocaleDateString("id-ID")}</p>
              </div>
            </div>
            <h3 className="font-semibold mt-4 mb-3">Rincian Gaji</h3>
            <table className="min-w-full mb-6 border-collapse" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border" style={{ border: '1px solid #ccc' }}>Komponen</th>
                  <th className="px-4 py-2 text-left border" style={{ border: '1px solid #ccc' }}>Nominal</th>
                  <th className="px-4 py-2 text-left border" style={{ border: '1px solid #ccc' }}>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {selectedPayroll.components?.map((c: any) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 border" style={{ border: '1px solid #ccc' }}>{c.nama} ({c.tipe})</td>
                    <td className="px-4 py-2 border" style={{ border: '1px solid #ccc' }}>Rp {c.nominal.toLocaleString()}</td>
                    <td className="px-4 py-2 border" style={{ border: '1px solid #ccc' }}>{c.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold text-lg">Total: Rp {selectedPayroll.totalGaji.toLocaleString()}</div>
            <div className="mt-4 text-sm">Terbilang: <i>{terbilang(selectedPayroll.totalGaji)} rupiah</i></div>
            {/* Pengesahan Atasan (export) */}
            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="mb-12">Mengetahui/Pengesahan,<br />Atasan Langsung</div>
                <div style={{ minHeight: 40 }} />
                <div className="font-semibold underline">{supervisor || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black/70 flex items-center justify-center z-50 transition-colors duration-300" onClick={() => setShowBatchModal(false)}>
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 w-full max-w-2xl relative transition-colors duration-300 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 dark:text-dark-400 hover:text-gray-600 dark:hover:text-dark-200"
              onClick={() => setShowBatchModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-100">
              Generate Payroll Massal
            </h2>
            <form onSubmit={handleBatchSubmit}>
              <div className="mb-3 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Bulan
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={batchPeriode.bulan}
                    onChange={(e) =>
                      setBatchPeriode((p) => ({ ...p, bulan: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    placeholder="1-12"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-200">
                    Tahun
                  </label>
                  <input
                    type="number"
                    min={2020}
                    max={2100}
                    value={batchPeriode.tahun}
                    onChange={(e) =>
                      setBatchPeriode((p) => ({ ...p, tahun: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 border-gray-300 dark:border-dark-600"
                    placeholder="2024"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  disabled={batchLoading}
                >
                  {batchLoading ? "Memproses..." : "Proses Massal"}
                </button>
              </div>
            </form>
            {batchResult.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-dark-100">
                  Hasil:
                </h3>
                <ul className="max-h-48 overflow-y-auto text-sm">
                  {batchResult.map((r, i) => (
                    <li
                      key={i}
                      className={
                        r.success
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {r.nama} ({r.nik}):{" "}
                      {r.success ? "Berhasil" : `Gagal: ${r.error}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
