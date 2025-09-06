import React from 'react';
import { LogOut, User, Edit, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil & Logout</h1>
            <p className="text-gray-600">Kelola profil pengguna dan sesi login</p>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg">
            {/* Content Area */}
            <div className="p-6">
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Halaman Profil & Logout</h3>
                <p className="text-gray-500 mb-6">
                  Halaman ini akan berisi informasi profil pengguna dan pengaturan akun.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-gray-800 text-sm">
                    <strong>Fitur yang akan ditambahkan:</strong><br />
                    • Edit profil pengguna<br />
                    • Ubah password<br />
                    • Riwayat login<br />
                    • Pengaturan notifikasi<br />
                    • Logout aman
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

export default Profile;