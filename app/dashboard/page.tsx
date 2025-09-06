"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeProvider } from "../context/ThemeContext";
import AlertProvider from "../components/AlertProvider";
import ProfessionalSidebar from "../components/ProfessionalSidebar";
import UserDropdown from "../components/UserDropdown";
import UserSettingsModal from "../components/UserSettingsModal";
import Dashboard from "../components/pages/Dashboard";
import EmployeeManagement from "../components/pages/EmployeeManagement";
import Contracts from "../components/pages/Contracts";
import SalaryMaster from "../components/pages/SalaryMaster";
import KPIAssessment from "../components/pages/KPIAssessment";
import KPIIndividual from "../components/pages/KPIIndividual";
import Reports from "../components/pages/Reports";
import Settings from "../components/pages/Settings";
import Profile from "../components/pages/Profile";
import OperationalHRPage from "../operational-hr/page";

function DashboardApp() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showKPIIndividual, setShowKPIIndividual] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);

  const renderContent = () => {
    // Check for KPI individual route
    if (
      typeof window !== "undefined" &&
      window.location.pathname.includes("/kpi-individual/")
    ) {
      return <KPIIndividual />;
    }

    switch (activeItem) {
      case "dashboard":
        return <Dashboard />;
      case "management":
        return <EmployeeManagement />;
      case "contracts":
        return <Contracts />;
      case "salary":
        return <SalaryMaster />;
      case "kpi":
        return <KPIAssessment />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      case "operational-hr":
        return <OperationalHRPage />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ThemeProvider>
      <AlertProvider>
        <div className="flex h-screen bg-secondary dark:bg-dark-900 transition-colors duration-300">
          {/* Mobile menu button */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-primary dark:bg-dark-800 rounded-lg shadow-lg text-secondary dark:text-dark-200 hover:text-primary dark:hover:text-white transition-colors duration-200"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Backdrop for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <ProfessionalSidebar
            activeItem={activeItem}
            onItemClick={setActiveItem}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="bg-primary dark:bg-dark-800 border-b border-primary dark:border-dark-700 px-6 py-3 flex items-center justify-end transition-colors duration-300">
              <UserDropdown onSettingsClick={() => setShowUserSettings(true)} />
            </div>

            {renderContent()}
          </div>

          {/* User Settings Modal */}
          <UserSettingsModal
            isOpen={showUserSettings}
            onClose={() => setShowUserSettings(false)}
          />
        </div>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default DashboardApp;
