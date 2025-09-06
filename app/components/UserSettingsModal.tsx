import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Palette, 
  Save, 
  Eye, 
  EyeOff,
  Globe,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { showSuccess, showError } from '../utils/alerts';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: 'Staff HT',
    email: 'admin@rockscompany.com',
    phone: '+62 812 3456 7890',
    position: 'HR Manager',
    department: 'Human Resources'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    language: 'id',
    timezone: 'Asia/Jakarta'
  });

  const handleSaveProfile = () => {
    showSuccess('Profil berhasil diperbarui!');
  };

  const handleSaveSecurity = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      showError('Password baru dan konfirmasi password tidak cocok!');
      return;
    }
    showSuccess('Pengaturan keamanan berhasil diperbarui!');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: securityData.twoFactorEnabled
    });
  };

  const handleSaveNotifications = () => {
    showSuccess('Pengaturan notifikasi berhasil disimpan!');
  };

  const handleSaveTheme = () => {
    showSuccess('Pengaturan tema berhasil disimpan!');
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'theme', label: 'Tema', icon: Palette }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
          HR
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Foto Profil</h3>
          <p className="text-sm text-gray-500">Bergabung sejak: 01 Januari 2023</p>
          <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700">
            Edit Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
          <input
            type="text"
            value={profileData.position}
            onChange={(e) => setProfileData({...profileData, position: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
          <select
            value={profileData.department}
            onChange={(e) => setProfileData({...profileData, department: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Human Resources">Human Resources</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">Status Akun</h4>
        </div>
        <p className="text-sm text-yellow-700 mt-1">Login Terakhir: Hari ini, 09:45 WIB</p>
        <p className="text-sm text-yellow-700">Perangkat: Windows 10 • Chrome Browser</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Ganti Password</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={securityData.currentPassword}
              onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={securityData.newPassword}
              onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={securityData.confirmPassword}
            onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Login Dua Faktor</h4>
            <p className="text-sm text-gray-500">Tingkatkan keamanan akun dengan verifikasi dua langkah</p>
          </div>
          <button
            onClick={() => setSecurityData({...securityData, twoFactorEnabled: !securityData.twoFactorEnabled})}
            className={`w-12 h-6 rounded-full transition-colors ${
              securityData.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSecurity}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Pengaturan Akun</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Notifikasi Email</p>
                <p className="text-sm text-gray-500">Terima notifikasi melalui email</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
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
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Notifikasi Sistem</p>
                <p className="text-sm text-gray-500">Notifikasi dalam aplikasi</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Mode Gelap</p>
                <p className="text-sm text-gray-500">Aktifkan tema gelap</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Login Dua Faktor</p>
                <p className="text-sm text-gray-500">Keamanan tambahan untuk akun</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, weeklyReports: !notificationSettings.weeklyReports})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notificationSettings.weeklyReports ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notificationSettings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveNotifications}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </div>
  );

  const renderThemeTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Sesi Aktif</h4>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Chrome di Windows</p>
                  <p className="text-sm text-green-600">Jakarta, Indonesia • Saat ini aktif</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                Perangkat ini
              </span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Firefox di MacOS</p>
                  <p className="text-sm text-gray-600">Jakarta, Indonesia • 2 jam yang lalu</p>
                </div>
              </div>
              <button className="text-red-600 text-sm font-medium hover:text-red-700">
                Akhiri Sesi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Logout dari Sistem</h4>
          <p className="text-sm text-red-600 mb-4">
            Keluar dari sistem akan mengakhiri sesi Anda. Pastikan semua pekerjaan telah disimpan.
          </p>
          <div className="flex space-x-3">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Logout Sekarang
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Logout dari Semua Perangkat
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'theme':
        return renderThemeTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors duration-300 dark-transition">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-100">Profil Pengguna</h2>
            <p className="text-sm text-gray-500 dark:text-dark-400">Kelola informasi dan pengaturan akun Anda</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-gray-50 dark:bg-dark-700 border-r border-gray-200 dark:border-dark-600 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsModal;