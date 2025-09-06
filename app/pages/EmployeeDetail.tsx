import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { showSuccess, showError, showConfirm } from '../utils/alerts';

interface EmployeeDetailProps {
  employeeId?: string;
  onBack: () => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId, onBack }) => {
  const [employee] = useState({
    id: 'EMP001',
    nik: 'NIK001234567',
    namaLengkap: 'Brooklyn Simmons',
    foto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    jabatan: 'UI/UX Designer',
    status: 'Aktif' as const,
    
    // Data Pribadi
    tempatLahir: 'Jakarta',
    tanggalLahir: '15 Maret 1992',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    statusPernikahan: 'Belum Menikah',
    alamat: 'Jl. Sudirman No. 123, RT 05/RW 02, Kelurahan Senayan, Kecamatan Kebayoran Baru, Jakarta Selatan 12190',
    
    // Status Kepegawaian
    tanggalBergabung: '01 Januari 2023',
    departemen: 'Design',
    statusKontrak: 'PKWT',
    masaKerja: '1 tahun 2 bulan',
    grade: 'Senior Designer',
    
    // Kontak
    emailKantor: 'brooklyn.simmons@rocks.co.id',
    emailPribadi: 'brook.simmons@gmail.com',
    noTelepon: '+62 812 3456 7890',
    noDarurat: '+62 811 9876 5432',
    
    // Riwayat
    riwayatJabatan: [
      {
        id: 1,
        jabatan: 'UI/UX Designer',
        departemen: 'Design',
        tanggalMulai: '01 Jan 2023',
        tanggalSelesai: 'Sekarang',
        status: 'Aktif'
      },
      {
        id: 2,
        jabatan: 'Junior Designer',
        departemen: 'Design',
        tanggalMulai: '01 Jun 2022',
        tanggalSelesai: '31 Des 2022',
        status: 'Selesai'
      }
    ],
    
    riwayatDepartemen: [
      {
        id: 1,
        departemen: 'Design',
        tanggalMulai: '01 Jan 2023',
        tanggalSelesai: 'Sekarang',
        alasan: 'Promosi'
      }
    ],
    
    riwayatPromosi: [
      {
        id: 1,
        dari: 'Junior Designer',
        ke: 'UI/UX Designer',
        tanggal: '01 Jan 2023',
        alasan: 'Kinerja Baik',
        disetujuiOleh: 'HR Manager'
      }
    ]
  });

  const handleEdit = () => {
    showSuccess('Membuka form edit karyawan...');
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
      'Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan.'
    );
    if (confirmed) {
      showSuccess('Data karyawan berhasil dihapus');
      onBack();
    }
  };

  const handlePrint = () => {
    window.print();
    showSuccess('Mencetak data karyawan...');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Detail Karyawan</h1>
              <p className="text-gray-600">Informasi lengkap karyawan {employee.namaLengkap}</p>
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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Panel Informasi Utama */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <img
                      src={employee.foto}
                      alt={employee.namaLengkap}
                      className="w-32 h-32 rounded-xl object-cover border-4 border-gray-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{employee.namaLengkap}</h2>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">NIK: {employee.nik}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 font-medium">{employee.jabatan}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{employee.departemen}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          employee.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                        <span className="text-sm text-gray-500">ID: {employee.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Data Pribadi */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Data Pribadi</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Tempat & Tanggal Lahir</label>
                    <p className="text-gray-900">{employee.tempatLahir}, {employee.tanggalLahir}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Kelamin</label>
                    <p className="text-gray-900">{employee.jenisKelamin}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Agama</label>
                    <p className="text-gray-900">{employee.agama}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status Pernikahan</label>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{employee.statusPernikahan}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Alamat Lengkap</label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-900">{employee.alamat}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Status Kepegawaian */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Status Kepegawaian</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Bergabung</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{employee.tanggalBergabung}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Departemen</label>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{employee.departemen}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status Kontrak</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      employee.statusKontrak === 'PKWT' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {employee.statusKontrak}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Masa Kerja</label>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{employee.masaKerja}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Grade/Level</label>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{employee.grade}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Riwayat Pekerjaan */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Riwayat Pekerjaan</h3>
                </div>
                
                {/* Riwayat Jabatan */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 mb-4">Riwayat Jabatan</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Jabatan</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Departemen</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Periode</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {employee.riwayatJabatan.map((riwayat) => (
                          <tr key={riwayat.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">{riwayat.jabatan}</td>
                            <td className="py-3 px-4 text-gray-600">{riwayat.departemen}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {riwayat.tanggalMulai} - {riwayat.tanggalSelesai}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                riwayat.status === 'Aktif' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {riwayat.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Riwayat Promosi */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Riwayat Promosi/Mutasi</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Dari</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Ke</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Tanggal</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Alasan</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Disetujui Oleh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {employee.riwayatPromosi.map((promosi) => (
                          <tr key={promosi.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-600">{promosi.dari}</td>
                            <td className="py-3 px-4 font-medium text-gray-900">{promosi.ke}</td>
                            <td className="py-3 px-4 text-gray-600">{promosi.tanggal}</td>
                            <td className="py-3 px-4 text-gray-600">{promosi.alasan}</td>
                            <td className="py-3 px-4 text-gray-600">{promosi.disetujuiOleh}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Panel Kontak */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Informasi Kontak</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Kantor</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a 
                        href={`mailto:${employee.emailKantor}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {employee.emailKantor}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Pribadi</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a 
                        href={`mailto:${employee.emailPribadi}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {employee.emailPribadi}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">No. Telepon</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a 
                        href={`tel:${employee.noTelepon}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {employee.noTelepon}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">No. Darurat</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-red-500" />
                      <a 
                        href={`tel:${employee.noDarurat}`}
                        className="text-red-600 hover:text-red-700 hover:underline"
                      >
                        {employee.noDarurat}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistik Cepat</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Masa Kerja</span>
                    </div>
                    <span className="text-sm font-bold text-blue-900">{employee.masaKerja}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Grade</span>
                    </div>
                    <span className="text-sm font-bold text-green-900">{employee.grade}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Departemen</span>
                    </div>
                    <span className="text-sm font-bold text-purple-900">{employee.departemen}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">Status</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      employee.status === 'Aktif' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Panel Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Data Karyawan</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Data</span>
                  </button>
                  <button
                    onClick={handleDeactivate}
                    className="w-full flex items-center space-x-2 bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Nonaktifkan Karyawan</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Data</span>
                  </button>
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