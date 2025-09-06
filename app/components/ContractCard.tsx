import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
import { showInfo, showConfirm, showSuccess } from "../utils/alerts";

interface Contract {
  id: number;
  employee: {
    name: string;
    position: string;
    department: string;
    avatar: string;
  };
  status: "Aktif" | "Berakhir" | "Berakhir Segera";
  type: "PKWT" | "PKWTT";
  startDate: string;
  endDate: string;
  duration: string;
  statusColor: string;
  progressColor: string;
  nomorKontrak?: string; // Added nomorKontrak to the interface
}

interface ContractCardProps {
  contract: Contract;
  onEdit?: () => void;
  onDelete?: () => void;
  onExtend?: () => void;
  onLog?: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  onEdit,
  onDelete,
  onExtend,
  onLog,
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800";
      case "Berakhir":
        return "bg-red-100 text-red-800";
      case "Berakhir Segera":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-500";
      case "Berakhir":
        return "bg-red-500";
      case "Berakhir Segera":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewDocument = () => {
    // Create a mock PDF URL for demonstration
    const pdfUrl =
      "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEtvbnRyYWsgS2VyamEpCi9Qcm9kdWNlciAoUERGIEdlbmVyYXRvcikKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDEwMTAwMDAwMFopCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzQgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVApxCjcyIDcyMCA3MiA3MjAgcmUKUwpRCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAxMDggMDAwMDAgbiAKMDAwMDAwMDE1NSAwMDAwMCBuIAowMDAwMDAwMjEyIDAwMDAwIG4gCjAwMDAwMDAzMDkgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDIgMCBSCi9JbmZvIDEgMCBSCj4+CnN0YXJ0eHJlZgo0MDMKJSVFT0Y=";

    // Open PDF in new tab
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Kontrak Kerja - ${contract.employee.name}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 800px; margin: 0 auto; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>KONTRAK KERJA</h1>
              <h2>${contract.employee.name}</h2>
            </div>
            <div class="content">
              <p><strong>Nama:</strong> ${contract.employee.name}</p>
              <p><strong>Posisi:</strong> ${contract.employee.position}</p>
              <p><strong>Departemen:</strong> ${contract.employee.department}</p>
              <p><strong>Jenis Kontrak:</strong> ${contract.type}</p>
              <p><strong>Tanggal Mulai:</strong> ${contract.startDate}</p>
              <p><strong>Tanggal Berakhir:</strong> ${contract.endDate}</p>
              <p><strong>Durasi:</strong> ${contract.duration}</p>
              <p><strong>Status:</strong> ${contract.status}</p>
              <br>
              <p>Ini adalah contoh dokumen kontrak kerja. Dalam implementasi nyata, dokumen ini akan berisi detail lengkap kontrak kerja karyawan.</p>
            </div>
          </body>
        </html>
      `);
    }
  };

  const handleEditContract = async () => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin mengedit kontrak ${contract.employee.name}?`
    );
    if (confirmed) {
      showSuccess(`Membuka form edit kontrak untuk ${contract.employee.name}`);
    }
  };

  const handleDeleteContract = async () => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin menghapus kontrak ${contract.employee.name}?`
    );
    if (confirmed) {
      showSuccess(`Kontrak ${contract.employee.name} telah dihapus`);
    }
  };

  const handleDownloadContract = () => {
    // Create a downloadable PDF
    const element = document.createElement("a");
    const file = new Blob(
      [
        `
KONTRAK KERJA

Nama: ${contract.employee.name}
Posisi: ${contract.employee.position}
Departemen: ${contract.employee.department}
Jenis Kontrak: ${contract.type}
Tanggal Mulai: ${contract.startDate}
Tanggal Berakhir: ${contract.endDate}
Durasi: ${contract.duration}
Status: ${contract.status}

Dokumen ini adalah contoh kontrak kerja.
    `,
      ],
      { type: "text/plain" }
    );

    element.href = URL.createObjectURL(file);
    element.download = `Kontrak_${contract.employee.name.replace(
      /\s+/g,
      "_"
    )}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showSuccess(`Kontrak ${contract.employee.name} berhasil diunduh!`);
  };

  const handleExtendContract = async () => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin memperpanjang kontrak ${contract.employee.name}?`
    );
    if (confirmed) {
      showSuccess(
        `Membuka form perpanjangan kontrak untuk ${contract.employee.name}`
      );
    }
  };

  const handleLogExtension = () => {
    // Show extension history in a modal or new page
    const extensionHistory = [
      { date: "01 Jan 2023", action: "Kontrak Dibuat", duration: "12 bulan" },
      {
        date: "15 Nov 2023",
        action: "Perpanjangan Diajukan",
        duration: "12 bulan",
      },
      {
        date: "01 Dec 2023",
        action: "Perpanjangan Disetujui",
        duration: "12 bulan",
      },
    ];

    const historyText = extensionHistory
      .map((item) => `${item.date}: ${item.action} (${item.duration})`)
      .join("\n");

    showInfo(
      `Log Perpanjangan Kontrak - ${contract.employee.name}: ${extensionHistory.length} entri riwayat tersedia`
    );
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 hover:shadow-lg transition-all duration-200 dark-transition interactive-element">
      {/* Header with employee info */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={contract.employee.avatar}
            alt={contract.employee.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold text-gray-900 dark:text-dark-100 truncate"
              title={contract.employee.name}
            >
              {contract.employee.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-dark-400 truncate mb-1">
              No. Kontrak: {contract.nomorKontrak || "-"}
            </p>
            <p
              className="text-sm text-gray-500 dark:text-dark-400 truncate"
              title={`${
                contract.jobPosition?.name || contract.posisiJabatan || "-"
              } • ${contract.employee.department}`}
            >
              {contract.jobPosition?.name || contract.posisiJabatan || "-"} •{" "}
              {contract.department?.name || contract.departemen || "-"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium truncate ${getStatusBadgeColor(
              contract.status
            )} dark:bg-opacity-20`}
            style={{ maxWidth: 100 }}
          >
            {contract.status}
          </span>
          <span
            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium truncate"
            style={{ maxWidth: 100 }}
          >
            {contract.type}
          </span>
          <button className="p-1 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Contract details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-dark-400">Mulai:</span>
          <span className="text-gray-900 dark:text-dark-100 truncate max-w-[120px]">
            {contract.startDate}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-dark-400">Berakhir:</span>
          <span className="text-gray-900 dark:text-dark-100 truncate max-w-[120px]">
            {contract.endDate}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-dark-400">Durasi:</span>
          <span className="text-gray-900 dark:text-dark-100 truncate max-w-[120px]">
            {contract.duration}
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressBarColor(
              contract.status
            )}`}
            style={{
              width:
                contract.status === "Aktif"
                  ? "100%"
                  : contract.status === "Berakhir Segera"
                  ? "85%"
                  : "100%",
            }}
          />
        </div>
      </div>
      {/* Action buttons */}
      <div className="pt-4 border-t border-gray-100 dark:border-dark-600">
        <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
          <button
            onClick={handleViewDocument}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Dokumen</span>
          </button>
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 hover:bg-gray-50 dark:hover:bg-dark-700 rounded transition-colors"
              title="Edit Kontrak"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Hapus Kontrak"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onLog}
            className="flex items-center space-x-1 text-gray-600 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-700 px-2 py-1 rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Log Perpanjangan</span>
          </button>
          <button
            onClick={handleDownloadContract}
            className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh</span>
          </button>
          <button
            onClick={onExtend}
            className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-2 py-1 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Perpanjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractCard;
