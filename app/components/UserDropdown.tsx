import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Mail,
  Globe,
  Shield,
  Bell,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { showSuccess, showConfirm } from "../utils/alerts";
import { useTheme } from "../context/ThemeContext";

interface UserDropdownProps {
  onSettingsClick: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  // Mock user data
  const userData = {
    name: "Staff HT",
    email: "admin@rockscompany.com",
    ipAddress: "192.168.1.100",
    avatar: "HR",
    lastLogin: "Hari ini, 09:45 WIB",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Keluar dari sistem akan mengakhiri sesi Anda. Pastikan semua pekerjaan telah disimpan."
    );
    if (confirmed) {
      // Hapus token dari localStorage dan cookie
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
      showSuccess("Logout berhasil. Terima kasih telah menggunakan sistem!");
      // Redirect ke halaman login
      window.location.href = "/login";
    }
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    onSettingsClick();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    showSuccess(`Mode ${isDarkMode ? "terang" : "gelap"} diaktifkan`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200 group"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {userData.avatar}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-dark-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-600 py-2 z-50 animate-in slide-in-from-top-2 duration-200 backdrop-blur-none">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-600">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {userData.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-dark-100 truncate">
                  {userData.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-dark-400 truncate">
                  {userData.email}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-dark-300">
                <Globe className="w-4 h-4 text-gray-500 dark:text-dark-400" />
                <span>IP: {userData.ipAddress}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700 dark:text-dark-300">
                <User className="w-4 h-4 text-gray-500 dark:text-dark-400" />
                <span>Login terakhir: {userData.lastLogin}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-2 py-2">
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-150"
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-dark-400" />
              <span className="text-gray-900 dark:text-dark-200">
                Pengaturan
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-gray-500 dark:text-dark-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-500 dark:text-dark-400" />
                )}
                <span className="text-gray-900 dark:text-dark-200">
                  {isDarkMode ? "Mode Terang" : "Mode Gelap"}
                </span>
              </div>
              <div
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform top-0.5 ${
                    isDarkMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 dark:border-dark-600 px-2 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150 group"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400 font-medium">
                Logout dari Sistem
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
