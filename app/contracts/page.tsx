import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Calendar } from 'lucide-react';
import { showSuccess, showInfo } from '../utils/alerts';
import ContractCard from '../components/ContractCard';
import ContractSidebar from '../components/ContractSidebar';
import AddContractForm from '../components/AddContractForm';

const Contracts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const contracts = [
    {
      id: 1,
      employee: {
        name: 'Budi Santoso',
        position: 'UI/UX Designer',
        department: 'Design',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      status: 'Berakhir' as const,
      type: 'PKWT' as const,
      startDate: '01 Jan 2023',
      endDate: '31 Des 2023',
      duration: '12 bulan',
      statusColor: 'red',
      progressColor: 'red'
    },
    {
      id: 2,
      employee: {
        name: 'Dewi Lestari',
        position: 'Front-End Developer',
        department: 'Development',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      status: 'Berakhir Segera' as const,
      type: 'PKWTT' as const,
      startDate: '15 Feb 2023',
      endDate: '14 Feb 2024',
      duration: '12 bulan',
      statusColor: 'yellow',
      progressColor: 'yellow'
    },
    {
      id: 3,
      employee: {
        name: 'Ahmad Rizki',
        position: 'Back-End Developer',
        department: 'Development',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      status: 'Berakhir Segera' as const,
      type: 'PKWT' as const,
      startDate: '01 Mar 2023',
      endDate: '28 Feb 2024',
      duration: '12 bulan',
      statusColor: 'yellow',
      progressColor: 'yellow'
    },
    {
      id: 4,
      employee: {
        name: 'Siti Nuraini',
        position: 'HR Manager',
        department: 'Human Resource',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      status: 'Aktif' as const,
      type: 'PKWTT' as const,
      startDate: '01 Apr 2023',
      endDate: 'Permanen',
      duration: 'Tidak terbatas',
      statusColor: 'green',
      progressColor: 'green'
    },
    {
      id: 5,
      employee: {
        name: 'Rudi Hermawan',
        position: 'Product Manager',
        department: 'Product',
        avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      status: 'Aktif' as const,
      type: 'PKWT' as const,
      startDate: '15 Apr 2023',
      endDate: '14 Apr 2024',
      duration: '12 bulan',
      statusColor: 'green',
      progressColor: 'green'
    },
    {
      id: 6,
      employee: {
        name: 'Rina Wijaya',
        position: 'Graphic Designer',
        department: 'Design',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
      },
      status: 'Aktif' as const,
      type: 'PKWT' as const,
      startDate: '01 Mei 2023',
      endDate: '30 Apr 2024',
      duration: '12 bulan',
      statusColor: 'green',
      progressColor: 'green'
    }
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'semua') return matchesSearch;
    if (activeTab === 'aktif') return matchesSearch && contract.status === 'Aktif';
    if (activeTab === 'berakhir-segera') return matchesSearch && contract.status === 'Berakhir Segera';
    if (activeTab === 'berakhir') return matchesSearch && contract.status === 'Berakhir';
    if (activeTab === 'dibatalkan') return matchesSearch && contract.status === 'Dibatalkan';
    
    return matchesSearch;
  });

  const getTabCount = (status: string) => {
    if (status === 'semua') return contracts.length;
    if (status === 'aktif') return contracts.filter(c => c.status === 'Aktif').length;
    if (status === 'berakhir-segera') return contracts.filter(c => c.status === 'Berakhir Segera').length;
    if (status === 'berakhir') return contracts.filter(c => c.status === 'Berakhir').length;
    if (status === 'dibatalkan') return 0;
    return 0;
  };

  const handleAddContract = () => {
    setShowAddForm(true);
  };

  const handleBackToList = () => {
    setShowAddForm(false);
  };

  const handleSaveContract = (contractData: any) => {
    // Here you would typically save to your backend
    console.log('Saving contract:', contractData);
    alert('Kontrak berhasil disimpan!');
    setShowAddForm(false);
  };

  const handleFilter = () => {
    const filterOptions = [
      'Semua Status',
      'Aktif',
      'Berakhir Segera', 
      'Berakhir',
      'Jenis Kontrak: PKWT',
      'Jenis Kontrak: PKWTT',
      'Departemen: Design',
      'Departemen: Development',
      'Departemen: HR'
    ];
    
    const selectedFilter = prompt(`Pilih filter:\n${filterOptions.map((option, index) => `${index + 1}. ${option}`).join('\n')}\n\nMasukkan nomor pilihan:`);
    
    if (selectedFilter && filterOptions[parseInt(selectedFilter) - 1]) {
      showSuccess(`Filter diterapkan: ${filterOptions[parseInt(selectedFilter) - 1]}`);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If showing add form, render the form instead
  if (showAddForm) {
    return <AddContractForm onBack={handleBackToList} onSave={handleSaveContract} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">Kontrak Kerja</h1>
            <p className="text-gray-600 dark:text-dark-400">Manajemen dokumen & informasi kontrak karyawan</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleFilter}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button
              onClick={handleAddContract}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kontrak</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex items-center space-x-4 transition-colors duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-400">Total Kontrak Aktif</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">73</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex items-center space-x-4 transition-colors duration-300">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⚠</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-400">Berakhir Segera</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">12</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-600 flex items-center space-x-4 transition-colors duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-dark-400">Memerlukan Perpanjangan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">5</p>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 mb-6 transition-colors duration-300">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1">
                {[
                  { id: 'semua', label: 'Semua' },
                  { id: 'aktif', label: 'Aktif' },
                  { id: 'berakhir-segera', label: 'Berakhir Segera' },
                  { id: 'berakhir', label: 'Berakhir' },
                  { id: 'dibatalkan', label: 'Dibatalkan' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.id ? 'bg-blue-200 dark:bg-blue-800' : 'bg-gray-200 dark:bg-dark-600'
                    }`}>
                      {getTabCount(tab.id)}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-dark-600 shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-dark-600 shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-300"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari kontrak berdasarkan nama, posisi, atau departemen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
          </div>

          {/* Contracts Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </div>

          {/* Empty State */}
          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-dark-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Tidak ada kontrak ditemukan</h3>
              <p className="text-gray-500 dark:text-dark-400">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Calendar Button - Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors lg:hidden flex items-center justify-center"
      >
        <Calendar className="w-6 h-6" />
      </button>

      {/* Contract Sidebar */}
      <ContractSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default Contracts;