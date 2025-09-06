import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  UserX,
  Trash2,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Award,
  Clock,
  User,
  Heart,
  Shield,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { showSuccess, showError, showConfirm } from "../../utils/alerts";
import EditEmployeeForm from "../EditEmployeeForm";

interface EmployeeDetailProps {
  employeeId?: string;
  onBack: () => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employeeId,
  onBack,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/employee/detail?id=${employeeId}`);
        const data = await res.json();
        if (data.success) {
          setEmployee(data.employee);
        } else {
          showError(data.error || "Gagal mengambil data karyawan");
          onBack();
        }
      } catch (err) {
        showError("Gagal mengambil data karyawan");
        onBack();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [employeeId, onBack]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDeactivate = async () => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin menonaktifkan karyawan ${employee.namaLengkap}? Status karyawan akan berubah menjadi nonaktif.`
    );
    if (confirmed) {
      showSuccess(`${employee.namaLengkap} telah dinonaktifkan`);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (confirmed) {
      showSuccess("Data karyawan berhasil dihapus");
      onBack();
    }
  };

  const handlePrint = () => {
    window.print();
    showSuccess("Mencetak data karyawan...");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (editMode && employeeId) {
    return (
      <EditEmployeeForm
        employeeId={Number(employeeId)}
        onBack={() => setEditMode(false)}
        onSuccess={() => {
          setEditMode(false);
          onBack();
        }}
      />
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (!employee) {
    return (
      <div className="p-8 text-center text-red-500">
        Data karyawan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detail Karyawan
              </h1>
              <p className="text-gray-600">
                Informasi lengkap karyawan {employee.namaLengkap}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Data</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Data</span>
            </button>
            <button
              onClick={handleDeactivate}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              <UserX className="w-4 h-4" />
              <span>Nonaktifkan</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {employee.foto ? (
                  <img
                    src={employee.foto}
                    alt="Foto Profil"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-32 h-32 text-gray-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {employee.namaLengkap}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {employee.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-900">
                      {employee.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nomor Telepon</p>
                    <p className="font-medium text-gray-900">
                      {employee.nomorTelepon}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Lahir</p>
                    <p className="font-medium text-gray-900">
                      {employee.tanggalLahir
                        ? new Date(employee.tanggalLahir).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenis Kelamin</p>
                    <p className="font-medium text-gray-900">
                      {employee.jenisKelamin}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nomor Rekening</p>
                    <p className="font-medium text-gray-900">
                      {employee.nomorRekening || "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium text-gray-900">
                      {employee.alamat}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">KTP</p>
                    {employee.ktp ? (
                      <a
                        href={employee.ktp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat KTP
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NPWP</p>
                    {employee.npwp ? (
                      <a
                        href={employee.npwp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat NPWP
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ijazah</p>
                    {employee.ijazah ? (
                      <a
                        href={employee.ijazah}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat Ijazah
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CV</p>
                    {employee.cv ? (
                      <a
                        href={employee.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat CV
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDetail;
