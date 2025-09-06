import React from 'react';
import { BarChart3, Download, Search, Filter } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">Laporan & Monitoring</h1>
            <p className="text-gray-600 dark:text-dark-400">Analisis data dan laporan komprehensif</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Laporan</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            {/* Search and Filter Bar */}
            <div className="p-6 border-b border-gray-200 dark:border-dark-600">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari laporan..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-300">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 dark:text-dark-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Halaman Laporan & Monitoring</h3>
                <p className="text-gray-500 dark:text-dark-400 mb-6">
                  Halaman ini akan berisi berbagai laporan analitik dan dashboard monitoring real-time.
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-indigo-800 dark:text-indigo-300 text-sm">
                    <strong>Fitur yang akan ditambahkan:</strong><br />
                    • Laporan absensi<br />
                    • Analisis produktivitas<br />
                    • Report penggajian<br />
                    • Dashboard real-time<br />
                    • Export ke Excel/PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;