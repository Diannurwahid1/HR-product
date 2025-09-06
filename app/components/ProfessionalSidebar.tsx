import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  FileText,
  DollarSign,
  Award,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  category?: string;
  description?: string;
}

const ProfessionalSidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  className = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      category: "main",
      description: "Overview dan statistik utama",
    },
    {
      id: "management",
      label: "Manajemen Karyawan",
      icon: Users,
      category: "main",
      description: "Kelola data karyawan",
    },
    {
      id: "contracts",
      label: "Kontrak Kerja",
      icon: FileText,
      category: "main",
      description: "Manajemen kontrak dan dokumen",
    },
    {
      id: "salary",
      label: "Master Gaji",
      icon: DollarSign,
      category: "main",
      description: "Struktur gaji dan tunjangan",
    },
    {
      id: "kpi",
      label: "Penilaian KPI",
      icon: Award,
      category: "main",
      description: "Evaluasi kinerja karyawan",
    },
    {
      id: "reports",
      label: "Laporan & Monitoring",
      icon: BarChart3,
      category: "main",
      description: "Analisis dan laporan",
    },
    {
      id: "operational-hr",
      label: "Operational HR",
      icon: FileText,
      category: "main",
      description: "Menu operasional HR",
    },
    {
      id: "settings",
      label: "Pengaturan Sistem",
      icon: Settings,
      badge: "BARU",
      category: "system",
      description: "Konfigurasi sistem",
    },
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle item click
  const handleItemClick = (itemId: string) => {
    onItemClick(itemId);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className={`fixed top-4 left-4 z-50 p-3 rounded-xl transition-all duration-300 lg:hidden shadow-lg backdrop-blur-sm ${
        isMobileOpen
          ? "text-white bg-slate-800/90 border border-slate-600"
          : "text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
      }`}
      aria-label={isMobileOpen ? "Close menu" : "Open menu"}
    >
      {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  // Tooltip component for collapsed state
  const Tooltip: React.FC<{
    children: React.ReactNode;
    text: string;
    description?: string;
    show: boolean;
  }> = ({ children, text, description, show }) => (
    <div className="relative group">
      {children}
      {show && isCollapsed && !isMobile && (
        <div className="absolute left-full ml-3 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-700 min-w-max">
          <div className="font-semibold">{text}</div>
          {description && (
            <div className="text-xs text-slate-300 mt-1">{description}</div>
          )}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45 border-l border-b border-slate-700" />
        </div>
      )}
    </div>
  );

  // Menu item component
  const MenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <Tooltip text={item.label} description={item.description} show={true}>
        <button
          onClick={() => handleItemClick(item.id)}
          className={`
            w-full flex items-center transition-all duration-300 rounded-xl group relative overflow-hidden
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
            ${isCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3"}
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                : "text-slate-300 hover:bg-slate-800 hover:text-white hover:scale-105"
            }
          `}
          aria-label={item.label}
          role="menuitem"
        >
          {/* Background gradient for active state */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100" />
          )}

          {/* Hover background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Icon
            className={`
              w-5 h-5 flex-shrink-0 transition-all duration-300 relative z-10
              ${isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110"}
            `}
          />
          {!isCollapsed && (
            <>
              <div className="flex-1 text-left relative z-10">
                <div className="font-medium text-sm leading-5 truncate">
                  {item.label}
                </div>
                {item.description && !isActive && (
                  <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300 truncate">
                    {item.description}
                  </div>
                )}
              </div>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold relative z-10 shadow-sm">
                  {item.badge}
                </span>
              )}
            </>
          )}
          {isCollapsed && item.badge && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <>
      <MobileMenuButton />

      {/* Mobile backdrop */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-slate-900 border-r border-slate-800 text-slate-300 shadow-2xl
          ${isCollapsed ? "w-20" : "w-80"}
          ${isMobile ? "fixed" : "relative"}
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
          h-screen flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${className}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex-shrink-0">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Richz-HR</span>
                <span className="text-xs text-slate-400">
                  Professional Edition
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 flex-shrink-0 border-b border-slate-800">
          <div
            className={`flex ${
              isCollapsed ? "justify-center" : "justify-between items-center"
            }`}
          >
            {/* Collapse toggle */}
            {!isMobile && (
              <Tooltip
                text={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                show={true}
              >
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg transition-all duration-300 text-slate-400 hover:bg-slate-800 hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={
                    isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
            )}

            {!isCollapsed && (
              <div className="text-xs text-slate-400">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin"
          role="menu"
        >
          {/* Main Menu */}
          <div className="mb-8">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 mb-4 px-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Menu Utama
                </p>
              </div>
            )}
            <div className="space-y-2">
              {menuItems
                .filter((item) => item.category === "main")
                .map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
            </div>
          </div>

          {/* System Menu */}
          <div>
            {!isCollapsed && (
              <div className="flex items-center space-x-2 mb-4 px-2">
                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Sistem
                </p>
              </div>
            )}
            <div className="space-y-2">
              {menuItems
                .filter((item) => item.category === "system")
                .map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-800 flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-semibold text-sm">Upgrade to Pro</h4>
                </div>
                <p className="text-xs opacity-90 mb-3 leading-relaxed">
                  Unlock advanced analytics, custom reports, and premium support
                </p>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default ProfessionalSidebar;
