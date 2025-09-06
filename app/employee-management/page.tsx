import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronDown } from 'lucide-react';
import { showSuccess } from '../utils/alerts';
import EmployeeCard from '../components/EmployeeCard';
import AddEmployeeForm from '../components/AddEmployeeForm';
import EmployeeDetail from './EmployeeDetail';

const EmployeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [employees, setEmployees] = useState([

    {
      id: 1,
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@rocks.co.id',
      position: 'UI/UX Designer',
      division: 'Design',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@rocks.co.id',
      position: 'Front-End Developer',
      division: 'Development',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      email: 'budi.santoso@rocks.co.id',
      position: 'Back-End Developer',
      division: 'Development',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      email: 'dewi.lestari@rocks.co.id',
      position: 'Product Manager',
      division: 'Management',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-gray-100 text-gray-800'
    },
    {
      id: 5,
      name: 'Rudi Hermawan',
      email: 'rudi.hermawan@rocks.co.id',
      position: 'HR Manager',
      division: 'HR',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 6,
      name: 'Rina Wijaya',
      email: 'rina.wijaya@rocks.co.id',
      position: 'Graphic Designer',
      division: 'Design',
      status: 'Nonaktif' as const,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-green-100 text-green-800'
    },
    {
      id: 7,
      name: 'Dimas Prayoga',
      email: 'dimas.prayoga@rocks.co.id',
      position: 'Marketing Specialist',
      division: 'Marketing',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 8,
      name: 'Anisa Rahma',
      email: 'anisa.rahma@rocks.co.id',
      position: 'Finance Manager',
      division: 'Finance',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 9,
      name: 'Rizky Pratama',
      email: 'rizky.pratama@rocks.co.id',
      position: 'QA Engineer',
      division: 'Development',
      status: 'Nonaktif' as const,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 10,
      name: 'Maya Indah',
      email: 'maya.indah@rocks.co.id',
      position: 'Content Writer',
      division: 'Marketing',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 11,
      name: 'Eko Prasetyo',
      email: 'eko.prasetyo@rocks.co.id',
      position: 'System Analyst',
      division: 'Development',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 12,
      name: 'Putri Rahayu',
      email: 'putri.rahayu@rocks.co.id',
      position: 'Customer Support',
      division: 'Operations',
      status: 'Aktif' as const,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-orange-100 text-orange-800'
    }
  ]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && employee.status === 'Aktif';
    if (activeTab === 'inactive') return matchesSearch && employee.status === 'Nonaktif';
    
    return matchesSearch;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Aktif').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'Nonaktif').length;

  const handleAddEmployee = () => {
    setShowAddForm(true);
  };

  const handleBackToList = () => {
    setShowAddForm(false);
  };

  const handleSaveEmployee = (employeeData: any) => {
    // Generate new employee object
    const newEmployee = {
      id: employees.length + 1,
      name: employeeData.namaLengkap,
      email: employeeData.email,
      position: 'New Employee', // You can add position field to form
      division: 'General', // You can add division field to form
      status: 'Aktif' as const,
      avatar: employeeData.files.foto ? URL.createObjectURL(employeeData.files.foto) : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      divisionColor: 'bg-gray-100 text-gray-800'
    };

    // Add to employees list
    setEmployees(prev => [...prev, newEmployee]);
    
    // Go back to list
    setShowAddForm(false);
  };

  const handleViewDetail = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setShowDetailView(true);
  };

  const handleBackFromDetail = () => {
    setShowDetailView(false);
    setSelectedEmployeeId(null);
  };

  // If showing add form, render the form instead
  if (showAddForm) {
    return <AddEmployeeForm onBack={handleBackToList} onSave={handleSaveEmployee} />;
  }

  // If showing detail view, render the detail page instead
  if (showDetailView) {
    return <EmployeeDetail employeeId={selectedEmployeeId} onBack={handleBackFromDetail} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">Manajemen Karyawan</h1>
            <p className="text-gray-600 dark:text-dark-400">Kelola data karyawan perusahaan Anda</p>
          </div>
          <button 
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-dark-400 mb-2">Total Karyawan</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">{totalEmployees}</p>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-dark-400 mb-2">Karyawan Aktif</h3>
              <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-dark-400 mb-2">Karyawan Nonaktif</h3>
              <p className="text-3xl font-bold text-red-600">{inactiveEmployees}</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200'
                  }`}
                >
                  Semua Karyawan
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'active'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200'
                  }`}
                >
                  Aktif
                </button>
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'inactive'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200'
                  }`}
                >
                  Nonaktif
                </button>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400 dark:text-dark-500" />
                  <select 
                    onChange={(e) => showSuccess(`Filter divisi diterapkan: ${e.target.value}`)}
                    className="text-sm border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option>Divisi</option>
                    <option>Design</option>
                    <option>Development</option>
                    <option>HR</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Management</option>
                    <option>Operations</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-dark-500 -ml-8 pointer-events-none" />
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    onChange={(e) => showSuccess(`Filter posisi diterapkan: ${e.target.value}`)}
                    className="text-sm border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option>Posisi</option>
                    <option>Manager</option>
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Specialist</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-dark-500 -ml-8 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari karyawan berdasarkan nama, email, atau posisi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                onViewDetail={handleViewDetail}
              />
            ))}
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

export default EmployeeManagement;