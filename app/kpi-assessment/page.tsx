import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, MoreVertical, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { showInfo, showConfirm, showSuccess } from '../utils/alerts';

interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  kpiScore: number;
  status: 'Disetujui' | 'Menunggu Persetujuan' | 'Draft';
  lastUpdate: string;
  avatar: string;
  departmentColor: string;
}

const KPIAssessment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('Kuartal 1 - 2024');
  const [selectedDepartment, setSelectedDepartment] = useState('Semua Departemen');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const employees: Employee[] = [
    {
      id: 1,
      name: 'Budi Santoso',
      department: 'Design',
      position: 'UI/UX Designer',
      kpiScore: 4.0,
      status: 'Menunggu Persetujuan',
      lastUpdate: '15 Apr 2024',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      name: 'Rina Wijaya',
      department: 'Marketing',
      position: 'Marketing Manager',
      kpiScore: 4.5,
      status: 'Disetujui',
      lastUpdate: '12 Apr 2024',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 3,
      name: 'Ahmad Fauzi',
      department: 'Engineering',
      position: 'Software Engineer',
      kpiScore: 3.8,
      status: 'Disetujui',
      lastUpdate: '10 Apr 2024',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 4,
      name: 'Siti Nurhaliza',
      department: 'Finance',
      position: 'Finance Analyst',
      kpiScore: 4.2,
      status: 'Disetujui',
      lastUpdate: '08 Apr 2024',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 5,
      name: 'Doni Pratama',
      department: 'Sales',
      position: 'Sales Executive',
      kpiScore: 3.5,
      status: 'Draft',
      lastUpdate: '05 Apr 2024',
      avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-red-100 text-red-800'
    },
    {
      id: 6,
      name: 'Maya Indah',
      department: 'Customer Service',
      position: 'CS Manager',
      kpiScore: 4.3,
      status: 'Disetujui',
      lastUpdate: '03 Apr 2024',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 7,
      name: 'Rudi Hartono',
      department: 'IT',
      position: 'IT Support',
      kpiScore: 3.9,
      status: 'Menunggu Persetujuan',
      lastUpdate: '01 Apr 2024',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: 8,
      name: 'Dewi Lestari',
      department: 'HR',
      position: 'HR Specialist',
      kpiScore: 4.1,
      status: 'Disetujui',
      lastUpdate: '28 Mar 2024',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 9,
      name: 'Eko Susanto',
      department: 'Operations',
      position: 'Operations Manager',
      kpiScore: 3.7,
      status: 'Draft',
      lastUpdate: '25 Mar 2024',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 10,
      name: 'Lina Putri',
      department: 'Product',
      position: 'Product Manager',
      kpiScore: 4.4,
      status: 'Disetujui',
      lastUpdate: '22 Mar 2024',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      departmentColor: 'bg-pink-100 text-pink-800'
    }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'Semua Departemen' || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-green-100 text-green-800';
      case 'Menunggu Persetujuan':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKPIColor = (score: number) => {
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressWidth = (score: number) => {
    return (score / 5) * 100;
  };

  const handleViewKPI = (employee: Employee) => {
    // Navigate to individual KPI page
    window.location.href = `/kpi-individual/${employee.id}`;
  };

  const handleEditKPI = async (employee: Employee) => {
    const confirmed = await showConfirm(`Apakah Anda yakin ingin mengedit KPI ${employee.name}?`);
    if (confirmed) {
      showSuccess(`Membuka form edit KPI untuk ${employee.name}`);
    }
  };

  const handleMoreActions = (employee: Employee) => {
    const actions = [
      '1. Lihat Detail KPI',
      '2. Edit Penilaian',
      '3. Cetak Laporan',
      '4. Kirim Notifikasi',
      '5. Riwayat Penilaian'
    ];
    
    const selectedAction = prompt(`Pilih aksi untuk ${employee.name}:\n${actions.join('\n')}\n\nMasukkan nomor pilihan:`);
    
    if (selectedAction) {
      const actionIndex = parseInt(selectedAction) - 1;
      if (actionIndex >= 0 && actionIndex < actions.length) {
        showSuccess(`Menjalankan: ${actions[actionIndex].substring(3)} untuk ${employee.name}`);
      }
    }
  };

  const handleCreateAssessment = () => {
    showInfo('Membuka form penilaian KPI baru');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">Daftar Karyawan KPI</h1>
            <p className="text-gray-600 dark:text-dark-400">Evaluasi dan monitoring kinerja seluruh karyawan</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Quarter Filter */}
            <div className="relative">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="appearance-none bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-dark-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <option>Kuartal 1 - 2024</option>
                <option>Kuartal 2 - 2024</option>
                <option>Kuartal 3 - 2024</option>
                <option>Kuartal 4 - 2024</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-500 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 text-gray-900 dark:text-dark-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <option>Semua Departemen</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Engineering</option>
                <option>Finance</option>
                <option>Sales</option>
                <option>Customer Service</option>
                <option>IT</option>
                <option>HR</option>
                <option>Operations</option>
                <option>Product</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-dark-500 pointer-events-none" />
            </div>

            <button
              onClick={handleCreateAssessment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Penilaian Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
          </div>

          {/* KPI Table */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-hidden transition-colors duration-300">
            {/* Table Header */}
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 border-b border-gray-200 dark:border-dark-600">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                <div className="col-span-3">Nama Karyawan</div>
                <div className="col-span-2">Departemen</div>
                <div className="col-span-2">Posisi</div>
                <div className="col-span-2">Nilai KPI</div>
                <div className="col-span-2">Status KPI</div>
                <div className="col-span-1">Aksi</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-dark-600">
              {currentEmployees.map((employee) => (
                <div key={employee.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Employee Info */}
                    <div className="col-span-3 flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-dark-100 truncate">{employee.name}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-400 truncate">ID: EMP{employee.id.toString().padStart(3, '0')}</p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="col-span-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${employee.departmentColor} dark:bg-opacity-20 truncate`}>
                        {employee.department}
                      </span>
                    </div>

                    {/* Position */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-900 dark:text-dark-100 truncate" title={employee.position}>
                        {employee.position}
                      </p>
                    </div>

                    {/* KPI Score */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${getKPIColor(employee.kpiScore)}`}>
                              {employee.kpiScore}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                employee.kpiScore >= 4.0 ? 'bg-blue-500' :
                                employee.kpiScore >= 3.5 ? 'bg-green-500' :
                                employee.kpiScore >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${getProgressWidth(employee.kpiScore)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status)} dark:bg-opacity-20`}>
                          {employee.status}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-dark-400">{employee.lastUpdate}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewKPI(employee)}
                          className="p-2 text-gray-400 dark:text-dark-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditKPI(employee)}
                          className="p-2 text-gray-400 dark:text-dark-500 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          title="Edit KPI"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoreActions(employee)}
                          className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                          title="Aksi Lainnya"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 border-t border-gray-200 dark:border-dark-600">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-dark-300">
                  Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredEmployees.length)} dari {filteredEmployees.length} karyawan
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-dark-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Tidak ada karyawan ditemukan</h3>
              <p className="text-gray-500 dark:text-dark-400">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KPIAssessment;