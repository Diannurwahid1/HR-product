import React from 'react';
import { Bell, Calendar } from 'lucide-react';
import { showInfo } from '../utils/alerts';
import MetricCard from '../components/MetricCard';
import WorkHoursChart from '../components/WorkHoursChart';
import TopEmployees from '../components/TopEmployees';
import RecentActivities from '../components/RecentActivities';

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">Dashboard</h1>
            <p className="text-gray-600 dark:text-dark-300">Selamat datang kembali di BordUp™</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-700 rounded-lg px-4 py-2 transition-colors duration-300">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-dark-400" />
              <span className="text-sm text-gray-900 dark:text-dark-200">1 Jan 2024 - 31 Jan 2024</span>
              <button 
                onClick={() => showInfo('Fitur pencarian berdasarkan tanggal akan segera tersedia!')}
                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Cari
              </button>
            </div>
            <button 
              onClick={() => showInfo('Tidak ada notifikasi baru')}
              className="p-2 text-gray-500 dark:text-dark-400 hover:text-gray-900 dark:hover:text-dark-200 relative transition-colors duration-200"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Karyawan"
              value="104"
              bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
              textColor="text-white"
            />
            <MetricCard
              title="AVG KPI"
              value="89%"
              bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
              textColor="text-white"
            />
            <MetricCard
              title="Total Penggajian"
              value={formatCurrency(324920830)}
              bgColor="bg-gradient-to-r from-green-500 to-green-600"
              textColor="text-white"
            />
          </div>

          {/* Charts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WorkHoursChart />
            </div>
            <div>
              <RecentActivities />
            </div>
          </div>

          {/* Top Employees */}
          <TopEmployees />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;