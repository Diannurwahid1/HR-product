import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Shield, 
  Target, 
  Bell, 
  Building, 
  Database, 
  Activity,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Check,
  X,
  Download,
  HelpCircle
} from 'lucide-react';
import { showSuccess, showError, showLoading, showInfo, showConfirm } from '../utils/alerts';

interface Permission {
  id: string;
  name: string;
  admin: boolean;
  manager: boolean;
  hrStaff: boolean;
  employee: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedRole, setSelectedRole] = useState('Semua Peran');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'dashboard',
      name: 'Dashboard',
      admin: true,
      manager: true,
      hrStaff: true,
      employee: true
    },
    {
      id: 'employee-management',
      name: 'Manajemen Karyawan',
      admin: true,
      manager: true,
      hrStaff: true,
      employee: false
    },
    {
      id: 'contract-view',
      name: 'Kontrak Kerja - Lihat',
      admin: true,
      manager: true,
      hrStaff: true,
      employee: true
    },
    {
      id: 'contract-edit',
      name: 'Kontrak Kerja - Edit',
      admin: true,
      manager: true,
      hrStaff: true,
      employee: false
    },
    {
      id: 'kpi-view',
      name: 'Penilaian KPI - Lihat',
      admin: true,
      manager: true,
      hrStaff: true,
      employee: true
    },
    {
      id: 'kpi-edit',
      name: 'Penilaian KPI - Edit',
      admin: true,
      manager: true,
      hrStaff: false,
      employee: false
    },
    {
      id: 'system-settings',
      name: 'Pengaturan Sistem',
      admin: true,
      manager: false,
      hrStaff: false,
      employee: false
    }
  ]);

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Rocks Company',
    address: 'Jakarta, Indonesia',
    phone: '+62 21 1234 5678',
    email: 'info@rocks.co.id',
    website: 'www.rocks.co.id',
    lastUpdated: '12/01/2024'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    templates: 8
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    lastBackup: '28/01/2024',
    retentionDays: 30
  });

  const handlePermissionChange = (permissionId: string, role: keyof Omit<Permission, 'id' | 'name'>) => {
    setPermissions(prev => prev.map(permission => 
      permission.id === permissionId 
        ? { ...permission, [role]: !permission[role] }
        : permission
    ));
    
    showSuccess('Izin berhasil diperbarui');
  };

  const handleSaveChanges = () => {
    showLoading(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('success');
        }, 1500);
      }),
      {
        loading: 'Menyimpan perubahan...',
        success: 'Pengaturan berhasil disimpan!',
        error: 'Gagal menyimpan pengaturan',
      }
    );
  };

  const handleAddRole = () => {
    setShowAddRoleModal(true);
  };

  const handleDeletePermission = (permissionId: string) => {
    setShowDeleteConfirm(permissionId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      setPermissions(prev => prev.filter(p => p.id !== showDeleteConfirm));
      showSuccess('Izin berhasil dihapus');
      setShowDeleteConfirm(null);
    }
  };

  const handleExportConfig = () => {
    const config = {
      permissions,
      companySettings,
      notificationSettings,
      backupSettings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-configuration.json';
    link.click();
    
    showSuccess('Konfigurasi berhasil diekspor!');
  };

  const handleBackup = () => {
    showLoading(
      new Promise((resolve) => {
        setTimeout(() => {
          setBackupSettings(prev => ({
            ...prev,
            lastBackup: new Date().toLocaleDateString('id-ID')
          }));
          resolve('success');
        }, 2000);
      }),
      {
        loading: 'Membuat backup...',
        success: 'Backup berhasil dibuat!',
        error: 'Gagal membuat backup',
      }
    );
  };

  const handleRestore = () => {
    showLoading(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve('success');
          } else {
            reject('error');
          }
        }, 2000);
      }),
      {
        loading: 'Memulihkan data...',
        success: 'Data berhasil dipulihkan!',
        error: 'Gagal memulihkan data',
      }
    );
  };

  const settingsCards = [
    {
      id: 'roles',
      title: 'Role & Permission',
      description: 'Pengaturan peran pengguna dan hak akses',
      icon: Shield,
      color: 'bg-blue-50 text-blue-600',
      stats: '5 peran terdaftar',
      action: 'Kelola'
    },
    {
      id: 'kpi',
      title: 'Konfigurasi KPI',
      description: 'Pengaturan indikator kinerja untuk karyawan',
      icon: Target,
      color: 'bg-green-50 text-green-600',
      stats: '12 indikator aktif',
      action: 'Kelola'
    },
    {
      id: 'notifications',
      title: 'Pengaturan Notifikasi',
      description: 'Konfigurasi notifikasi email dan sistem',
      icon: Bell,
      color: 'bg-purple-50 text-purple-600',
      stats: '8 template tersedia',
      action: 'Kelola'
    },
    {
      id: 'company',
      title: 'Pengaturan Perusahaan',
      description: 'Informasi perusahaan dan identitas',
      icon: Building,
      color: 'bg-orange-50 text-orange-600',
      stats: 'Terakhir diperbarui 12/01/2024',
      action: 'Kelola'
    },
    {
      id: 'backup',
      title: 'Backup & Restore',
      description: 'Pengaturan cadangan dan pemulihan data',
      icon: Database,
      color: 'bg-cyan-50 text-cyan-600',
      stats: 'Backup terakhir 28/01/2024',
      action: 'Kelola'
    },
    {
      id: 'activity',
      title: 'Log Aktivitas',
      description: 'Catatan aktivitas penggunaan sistem',
      icon: Activity,
      color: 'bg-red-50 text-red-600',
      stats: '247 aktivitas bulan ini',
      action: 'Lihat'
    }
  ];

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setActiveSection(card.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                >
                  {card.action}
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{card.description}</p>
              <p className="text-blue-600 text-sm font-medium">{card.stats}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRolesPermissions = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Semua Peran</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>HR Staff</option>
              <option>Karyawan</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari fungsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddRole}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Peran</span>
          </button>
          <button
            onClick={handleSaveChanges}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Fungsi Sistem</th>
                <th className="text-center py-4 px-4 font-medium text-gray-700">Admin</th>
                <th className="text-center py-4 px-4 font-medium text-gray-700">Manager</th>
                <th className="text-center py-4 px-4 font-medium text-gray-700">HR Staff</th>
                <th className="text-center py-4 px-4 font-medium text-gray-700">Karyawan</th>
                <th className="text-center py-4 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPermissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{permission.name}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handlePermissionChange(permission.id, 'admin')}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        permission.admin ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {permission.admin && <Check className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handlePermissionChange(permission.id, 'manager')}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        permission.manager ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {permission.manager && <Check className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handlePermissionChange(permission.id, 'hrStaff')}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        permission.hrStaff ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {permission.hrStaff ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handlePermissionChange(permission.id, 'employee')}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        permission.employee ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {permission.employee ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => showSuccess(`Mengedit izin: ${permission.name}`)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePermission(permission.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600">
          Menampilkan {filteredPermissions.length} dari {permissions.length} fungsi sistem
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'roles':
        return renderRolesPermissions();
      case 'kpi':
        return (
          <div className="bg-white rounded-xl p-8 text-center">
            <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Konfigurasi KPI</h3>
            <p className="text-gray-500 mb-6">Pengaturan indikator kinerja untuk evaluasi karyawan.</p>
            <button
              onClick={() => showSuccess('Membuka konfigurasi KPI')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Kelola KPI
            </button>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Pengaturan Notifikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
                </div>
                <button
                  onClick={() => {
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }));
                    showSuccess('Pengaturan email diperbarui');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Terima notifikasi push</p>
                </div>
                <button
                  onClick={() => {
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }));
                    showSuccess('Pengaturan push notification diperbarui');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'backup':
        return (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Backup & Restore</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Backup Data</h4>
                <p className="text-sm text-gray-600">Backup terakhir: {backupSettings.lastBackup}</p>
                <button
                  onClick={handleBackup}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Buat Backup Sekarang
                </button>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Restore Data</h4>
                <p className="text-sm text-gray-600">Pulihkan data dari backup</p>
                <button
                  onClick={handleRestore}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Restore Data
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">Pengaturan Sistem Admin</h1>
            <p className="text-gray-600 dark:text-dark-400">Kelola konfigurasi sistem dan hak akses</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => showInfo('Bantuan akan segera tersedia')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan</span>
            </button>
            <button
              onClick={handleExportConfig}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Konfigurasi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {activeSection !== 'overview' && (
        <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600 px-6 transition-colors duration-300">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className="py-4 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-medium"
            >
              ← Kembali ke Overview
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 dark:text-dark-400 mb-6">
              Apakah Anda yakin ingin menghapus izin ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-dark-600 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Tambah Peran Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Nama Peran</label>
                <input
                  type="text"
                  placeholder="Masukkan nama peran"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Deskripsi</label>
                <textarea
                  placeholder="Deskripsi peran"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddRoleModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-200 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowAddRoleModal(false);
                  showSuccess('Peran baru berhasil ditambahkan!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;