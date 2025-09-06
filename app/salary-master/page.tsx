import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { showSuccess, showInfo, showConfirm } from '../utils/alerts';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
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
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Semua Departemen');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const employees: Employee[] = [
    {
      id: '1',
      name: 'Brooklyn Simmons',
      email: 'brook.simmons@gmail.com',
      position: 'UI Designer',
      department: 'Design',
      baseSalary: 5800000,
      totalSalary: 7570000,
      lastUpdated: '01/01/2024',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      components: [
        { id: '1', name: 'Tunjangan Jabatan', type: 'fixed', amount: 580000, percentage: 10, description: '10% dari gaji pokok' },
        { id: '2', name: 'Tunjangan Transportasi', type: 'fixed', amount: 500000, description: 'Tetap Rp 500.000' },
        { id: '3', name: 'Tunjangan Makan', type: 'fixed', amount: 400000, description: 'Tetap Rp 400.000' },
        { id: '4', name: 'Tunjangan Kesehatan', type: 'fixed', amount: 290000, percentage: 5, description: '5% dari gaji pokok' }
      ]
    },
    {
      id: '2',
      name: 'Cody Fisher',
      email: 'cody.fisher@gmail.com',
      position: 'Front-End Developer',
      department: 'Development',
      baseSalary: 6500000,
      totalSalary: 8450000,
      lastUpdated: '01/01/2024',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      components: [
        { id: '1', name: 'Tunjangan Jabatan', type: 'fixed', amount: 650000, percentage: 10, description: '10% dari gaji pokok' },
        { id: '2', name: 'Tunjangan Transportasi', type: 'fixed', amount: 500000, description: 'Tetap Rp 500.000' },
        { id: '3', name: 'Tunjangan Makan', type: 'fixed', amount: 400000, description: 'Tetap Rp 400.000' },
        { id: '4', name: 'Tunjangan Kesehatan', type: 'fixed', amount: 400000, percentage: 6, description: '6% dari gaji pokok' }
      ]
    },
    {
      id: '3',
      name: 'Ralph Edwards',
      email: 'ralph.edwards@gmail.com',
      position: 'UX Designer',
      department: 'Design',
      baseSalary: 5500000,
      totalSalary: 7150000,
      lastUpdated: '01/01/2024',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      components: [
        { id: '1', name: 'Tunjangan Jabatan', type: 'fixed', amount: 550000, percentage: 10, description: '10% dari gaji pokok' },
        { id: '2', name: 'Tunjangan Transportasi', type: 'fixed', amount: 500000, description: 'Tetap Rp 500.000' },
        { id: '3', name: 'Tunjangan Makan', type: 'fixed', amount: 400000, description: 'Tetap Rp 400.000' },
        { id: '4', name: 'Tunjangan Kesehatan', type: 'fixed', amount: 300000, percentage: 5, description: '5% dari gaji pokok' }
      ]
    },
    {
      id: '4',
      name: 'Eleanor Maggie',
      email: 'eleanor.maggie@gmail.com',
      position: 'UI/UX Designer',
      department: 'Design',
      baseSalary: 5600000,
      totalSalary: 7280000,
      lastUpdated: '01/01/2024',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      components: [
        { id: '1', name: 'Tunjangan Jabatan', type: 'fixed', amount: 560000, percentage: 10, description: '10% dari gaji pokok' },
        { id: '2', name: 'Tunjangan Transportasi', type: 'fixed', amount: 500000, description: 'Tetap Rp 500.000' },
        { id: '3', name: 'Tunjangan Makan', type: 'fixed', amount: 400000, description: 'Tetap Rp 400.000' },
        { id: '4', name: 'Tunjangan Kesehatan', type: 'fixed', amount: 220000, percentage: 4, description: '4% dari gaji pokok' }
      ]
    },
    {
      id: '5',
      name: 'Kevin Malone',
      email: 'kevin.malone@gmail.com',
      position: 'UI/UX Designer',
      department: 'Design',
      baseSalary: 5600000,
      totalSalary: 7280000,
      lastUpdated: '01/01/2024',
      avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      components: [
        { id: '1', name: 'Tunjangan Jabatan', type: 'fixed', amount: 560000, percentage: 10, description: '10% dari gaji pokok' },
        { id: '2', name: 'Tunjangan Transportasi', type: 'fixed', amount: 500000, description: 'Tetap Rp 500.000' },
        { id: '3', name: 'Tunjangan Makan', type: 'fixed', amount: 400000, description: 'Tetap Rp 400.000' },
        { id: '4', name: 'Tunjangan Kesehatan', type: 'fixed', amount: 220000, percentage: 4, description: '4% dari gaji pokok' }
      ]
    }
  ];

  const salaryComponents = [
    { id: '1', name: 'Tunjangan Jabatan', description: '% 10% dari gaji pokok', amount: 580000 },
    { id: '2', name: 'Tunjangan Transportasi', description: '$ Tetap Rp 500.000', amount: 500000 },
    { id: '3', name: 'Tunjangan Makan', description: '$ Tetap Rp 400.000', amount: 400000 },
    { id: '4', name: 'Tunjangan Kesehatan', description: '% 5% dari gaji pokok', amount: 290000 }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'Semua Departemen' || employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetail = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleEditSalary = async (employee: Employee) => {
    const confirmed = await showConfirm(`Apakah Anda yakin ingin mengedit gaji ${employee.name}?`);
    if (confirmed) {
      showSuccess(`Membuka form edit gaji untuk ${employee.name}`);
    }
  };

  const handleDeleteSalary = async (employee: Employee) => {
    const confirmed = await showConfirm(`Apakah Anda yakin ingin menghapus data gaji ${employee.name}?`);
    if (confirmed) {
      showSuccess(`Data gaji ${employee.name} berhasil dihapus`);
    }
  };

  const handleExportData = () => {
    showSuccess('Data gaji berhasil diekspor ke Excel!');
  };

  const handleImportData = () => {
    showInfo('Fitur import data akan segera tersedia');
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Design': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Marketing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'HR': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return colors[department] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const renderEmployeesTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-primary dark:bg-dark-800 rounded-xl border border-primary dark:border-dark-600 p-6 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary dark:text-dark-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-primary dark:border-dark-600 bg-primary dark:bg-dark-700 text-primary dark:text-dark-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="appearance-none bg-primary dark:bg-dark-700 border border-primary dark:border-dark-600 text-primary dark:text-dark-100 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            >
              <option>Semua Departemen</option>
              <option>Design</option>
              <option>Development</option>
              <option>Marketing</option>
              <option>HR</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary dark:text-dark-400 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleImportData}
              className="flex items-center space-x-2 px-4 py-3 border border-primary dark:border-dark-600 text-primary dark:text-dark-200 rounded-lg hover:bg-tertiary dark:hover:bg-dark-700 transition-colors duration-300"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-primary dark:bg-dark-800 rounded-xl border border-primary dark:border-dark-600 overflow-hidden transition-colors duration-300">
        {/* Table Header */}
        <div className="bg-tertiary dark:bg-dark-700 px-6 py-4 border-b border-primary dark:border-dark-600">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-secondary dark:text-dark-300 uppercase tracking-wider">
            <div className="col-span-3">Karyawan</div>
            <div className="col-span-2">Jabatan</div>
            <div className="col-span-2">Departemen</div>
            <div className="col-span-2">Gaji Pokok</div>
            <div className="col-span-2">Total Gaji</div>
            <div className="col-span-1">Aksi</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-primary dark:divide-dark-600">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="px-6 py-4 hover:bg-tertiary dark:hover:bg-dark-700 transition-colors duration-200">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Employee Info */}
                <div className="col-span-3 flex items-center space-x-3">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-primary dark:text-dark-100 truncate">{employee.name}</p>
                    <p className="text-sm text-secondary dark:text-dark-400 truncate">{employee.email}</p>
                  </div>
                </div>

                {/* Position */}
                <div className="col-span-2">
                  <p className="text-sm text-primary dark:text-dark-100 truncate" title={employee.position}>
                    {employee.position}
                  </p>
                </div>

                {/* Department */}
                <div className="col-span-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </span>
                </div>

                {/* Base Salary */}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-primary dark:text-dark-100">
                    {formatCurrency(employee.baseSalary)}
                  </p>
                  <p className="text-xs text-secondary dark:text-dark-400">Terakhir: {employee.lastUpdated}</p>
                </div>

                {/* Total Salary */}
                <div className="col-span-2">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(employee.totalSalary)}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetail(employee)}
                      className="p-2 text-secondary dark:text-dark-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditSalary(employee)}
                      className="p-2 text-secondary dark:text-dark-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      title="Edit Gaji"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSalary(employee)}
                      className="p-2 text-secondary dark:text-dark-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="bg-tertiary dark:bg-dark-700 px-6 py-4 text-sm text-secondary dark:text-dark-400 border-t border-primary dark:border-dark-600">
          Menampilkan {filteredEmployees.length} dari {employees.length} karyawan
        </div>
      </div>
    </div>
  );

  const renderComponentsTab = () => (
    <div className="space-y-6">
      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salaryComponents.map((component) => (
          <div key={component.id} className="bg-primary dark:bg-dark-800 rounded-xl border border-primary dark:border-dark-600 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-primary dark:text-dark-100 mb-2">{component.name}</h3>
                <p className="text-sm text-secondary dark:text-dark-400 mb-3">{component.description}</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(component.amount)}
                </p>
              </div>
              <button className="p-2 text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200 rounded-lg hover:bg-tertiary dark:hover:bg-dark-700 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-primary dark:border-dark-600">
              <button
                onClick={() => showSuccess(`Mengedit komponen: ${component.name}`)}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => showSuccess(`Melihat detail: ${component.name}`)}
                className="flex items-center space-x-1 text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                <span>Detail</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Component Button */}
      <div className="text-center">
        <button
          onClick={() => showInfo('Membuka form tambah komponen gaji')}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Komponen Gaji</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-primary dark:bg-dark-800 border-b border-primary dark:border-dark-600 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary dark:text-dark-100">Master Gaji Pokok</h1>
            <p className="text-secondary dark:text-dark-400">Kelola data gaji pokok dan tunjangan tetap karyawan</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => showInfo('Membuka form tambah struktur gaji')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Struktur Gaji</span>
            </button>
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
                  <p className="text-sm text-secondary dark:text-dark-400">Total Karyawan</p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">{employees.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary dark:bg-dark-800 rounded-xl p-6 border border-primary dark:border-dark-600 transition-colors duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-secondary dark:text-dark-400">Rata-rata Gaji</p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">
                    {formatCurrency(employees.reduce((sum, emp) => sum + emp.totalSalary, 0) / employees.length)}
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
                  <p className="text-sm text-secondary dark:text-dark-400">Total Penggajian</p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">
                    {formatCurrency(employees.reduce((sum, emp) => sum + emp.totalSalary, 0))}
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
                  <p className="text-sm text-secondary dark:text-dark-400">Komponen Tunjangan</p>
                  <p className="text-2xl font-bold text-primary dark:text-dark-100">{salaryComponents.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-primary dark:bg-dark-800 rounded-xl border border-primary dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'employees'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200'
                }`}
              >
                Daftar Gaji Pokok Karyawan
              </button>
              <button
                onClick={() => setActiveTab('components')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'components'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-secondary dark:text-dark-400 hover:text-primary dark:hover:text-dark-200'
                }`}
              >
                Komponen Tunjangan Tetap
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'employees' ? renderEmployeesTab() : renderComponentsTab()}
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
                  <h2 className="text-xl font-semibold text-primary dark:text-dark-100">{selectedEmployee.name}</h2>
                  <p className="text-sm text-secondary dark:text-dark-400">{selectedEmployee.position}</p>
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
                  <p className="text-sm text-secondary dark:text-dark-400 mb-1">Gaji Pokok</p>
                  <p className="text-xl font-bold text-primary dark:text-dark-100">
                    {formatCurrency(selectedEmployee.baseSalary)}
                  </p>
                </div>
                <div className="bg-tertiary dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-secondary dark:text-dark-400 mb-1">Total Gaji</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(selectedEmployee.totalSalary)}
                  </p>
                </div>
              </div>

              {/* Salary Components */}
              <div>
                <h3 className="text-lg font-semibold text-primary dark:text-dark-100 mb-4">Komponen Tunjangan Tetap</h3>
                <div className="space-y-3">
                  {selectedEmployee.components.map((component) => (
                    <div key={component.id} className="flex items-center justify-between p-4 bg-tertiary dark:bg-dark-700 rounded-lg">
                      <div>
                        <p className="font-medium text-primary dark:text-dark-100">{component.name}</p>
                        <p className="text-sm text-secondary dark:text-dark-400">{component.description}</p>
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
                  <span>{formatCurrency(selectedEmployee.totalSalary - selectedEmployee.baseSalary)}</span>
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