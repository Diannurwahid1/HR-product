import React from "react";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  Award,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "management", label: "Manajemen Karyawan", icon: Users },
    { id: "contracts", label: "Kontrak Kerja", icon: FileText },
    { id: "salary", label: "Master Gaji", icon: DollarSign },
    { id: "kpi", label: "Penilaian KPI", icon: Award },
    { id: "reports", label: "Laporan & Monitoring", icon: BarChart3 },
  ];

  const systemItems = [
    {
      id: "settings",
      label: "Pengaturan Sistem",
      icon: Settings,
      badge: "BARU",
    },
  ];

  const handleItemClick = (itemId: string) => {
    onItemClick(itemId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div
      className={`bg-slate-900 text-white ${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col fixed lg:relative z-50 transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">
            R
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold">Richz-HR</span>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <div className="hidden lg:block p-4">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-4">
        <div className="mb-6">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              MENU UTAMA
            </p>
          )}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center" : "space-x-3"
                  } px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Menu */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              SISTEM
            </p>
          )}
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center" : "space-x-3"
                  } px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Operational HR Menu */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              OPERATIONAL HR
            </p>
          )}
          <nav className="space-y-1">
            <Link
              href="/operational-hr"
              className={clsx(
                "flex items-center px-4 py-2 rounded-lg transition-colors",
                pathname === "/operational-hr"
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
                  : "hover:bg-gray-100 dark:hover:bg-dark-700"
              )}
            >
              <span className="ml-3">Operational HR</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
