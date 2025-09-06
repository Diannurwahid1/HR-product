import React from "react";
import {
  Bell,
  Calendar,
  Users,
  TrendingUp,
  Award,
  DollarSign,
} from "lucide-react";
import { showInfo } from "../../utils/alerts";
import MetricCard from "../MetricCard";
import WorkHoursChart from "../WorkHoursChart";
import TopEmployees from "../TopEmployees";
import RecentActivities from "../RecentActivities";

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const [loading, setLoading] = React.useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-dark-300 text-lg">
              Selamat datang kembali di{" "}
              <span className="font-sem ibold text-primary-600">BordUp™</span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 dark:bg-dark-700 rounded-xl px-4 py-3 transition-colors duration-300 border border-gray-200 dark:border-dark-600">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-dark-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-dark-200">
                1 Jan 2024 - 31 Jan 2024
              </span>
              <button
                onClick={() =>
                  showInfo(
                    "Fitur pencarian ber dasarkan tanggal akan segera tersedia!"
                  )
                }
                className="ml-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
              >
                Cari
              </button>
            </div>
            <button
              onClick={() => showInfo("Tidak ada notifikasi baru")}
              className="relative p-3 text-gray-500 dark:text-dark-400 hover:text-gray-900 dark:hover:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50  dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Metric Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/4 mb-2" />
                  <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded w-full mb-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Karyawan"
                value="104"
                icon={Users}
                description="Karyawan aktif saat ini"
                change={{
                  value: "+12%",
                  type: "increase",
                  period: "dari bulan lalu",
                }}
                className="hover:shadow-colored"
              />
              <MetricCard
                title="AVG KPI"
                value="89%"
                icon={Award}
                description="Rata-rata performa tim"
                change={{
                  value: "+5%",
                  type: "increase",
                  period: "dari kuartal lalu",
                }}
                className="hover:shadow-colored"
              />
              <MetricCard
                title="Total Penggajian"
                value={formatCurrency(324920830)}
                icon={DollarSign}
                description="Penggajian bulan ini"
                change={{
                  value: "+8%",
                  type: "increase",
                  period: "dari bulan lalu",
                }}
                className="hover:shadow-colored"
              />
              <MetricCard
                title="Kehadiran Bulan Ini"
                value="97%"
                icon={TrendingUp}
                description="Rata-rata kehadiran"
                change={{
                  value: "+2%",
                  type: "increase",
                  period: "dari bulan lalu",
                }}
                className="hover:shadow-colored"
              />
              <MetricCard
                title="Karyawan Baru"
                value="5"
                icon={Users}
                description="Bulan ini bergabung"
                change={{
                  value: "+1",
                  type: "increase",
                  period: "dari bulan lalu",
                }}
                className="hover:shadow-colored"
              />
              <MetricCard
                title="Proyek Aktif"
                value="8"
                icon={Bell}
                description="Proyek berjalan saat ini"
                change={{
                  value: "+2",
                  type: "increase",
                  period: "dari bulan lalu",
                }}
                className="hover:shadow-colored"
              />
            </div>
          )}

          {/* Enhanced Charts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WorkHoursChart />
            </div>
            <div>
              <RecentActivities />
            </div>
          </div>

          {/* Enhanced Top Employees */}
          <TopEmployees />

          {/* Quick Actions Section */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-dark-800 rounded-xl border-2 border-gray-200 dark:border-dark-600 p-4 animate-pulse"
                >
                  <div className="h-8 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3 mb-1" />
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-600 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100 mb-6">
                Aksi Cepat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Tambah Karyawan",
                    description: "Daftarkan karyawan baru",
                    icon: Users,
                    color:
                      "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
                  },
                  {
                    title: "Buat Kontrak",
                    description: "Kontrak kerja baru",
                    icon: TrendingUp,
                    color:
                      "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
                  },
                  {
                    title: "Evaluasi KPI",
                    description: "Penilaian kinerja",
                    icon: Award,
                    color:
                      "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
                  },
                  {
                    title: "Laporan Gaji",
                    description: "Generate laporan",
                    icon: DollarSign,
                    color:
                      "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200",
                  },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => showInfo(`Membuka ${action.title}`)}
                      className={`
                      p-4 rounded-xl border-2 transition-all duration-300 
                      hover:scale-105 hover:shadow-lg text-left group
                      ${action.color}
                    `}
                    >
                      <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="font-semibold text-sm mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs opacity-80">{action.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
