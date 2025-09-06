import React from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  UserX,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { showInfo, showConfirm, showSuccess } from "../utils/alerts";

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  division: string;
  status: "Aktif" | "Nonaktif";
  avatar: string;
  divisionColor: string;
  nik: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onViewDetail?: (employeeId: string) => void;
  onEdit?: (employeeId: string) => void;
  onDeactivate?: (employeeId: string) => void;
  onActivate?: (employeeId: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onViewDetail,
  onEdit,
  onDeactivate,
  onActivate,
}) => {
  const getStatusColor = (status: string) => {
    return status === "Aktif"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getDivisionBadgeColor = (division: string) => {
    const colors: { [key: string]: string } = {
      Design:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
      Development:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      HR: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      Marketing:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      Finance:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      Management:
        "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600",
      Operations:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    };
    return (
      colors[division] ||
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    );
  };

  const handleDetailClick = () => {
    if (onViewDetail) {
      onViewDetail(employee.id.toString());
    } else {
      showInfo(`Membuka detail karyawan ${employee.name}`);
    }
  };

  const handleEditClick = async () => {
    if (onEdit) {
      onEdit(employee.id.toString());
      return;
    }
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin mengedit data ${employee.name}?`
    );
    if (confirmed) {
      showSuccess(`Membuka form edit untuk ${employee.name}`);
    }
  };

  const handleDeactivateClick = async () => {
    if (employee.status === "Nonaktif") return;
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin menonaktifkan ${employee.name}?`
    );
    if (confirmed && onDeactivate) {
      onDeactivate(employee.id.toString());
    }
  };
  const handleActivateClick = async () => {
    if (employee.status === "Aktif") return;
    const confirmed = await showConfirm(`Aktifkan kembali ${employee.name}?`);
    if (confirmed && onActivate) {
      onActivate(employee.id.toString());
    }
  };

  const handleContactClick = (type: "email" | "phone") => {
    if (type === "email") {
      window.location.href = `mailto:${employee.email}`;
    } else {
      showInfo(`Menghubungi ${employee.name} via telepon`);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-6 hover:shadow-lg transition-all duration-300 dark-transition interactive-element group">
      {/* Header with avatar and menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-dark-600 transition-all duration-300 group-hover:ring-blue-200 dark:group-hover:ring-blue-800"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-dark-800 transition-colors duration-300 ${
                employee.status === "Aktif" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold text-gray-900 dark:text-dark-100 truncate transition-colors duration-300"
              title={employee.name}
            >
              {employee.name}
            </h3>
            <p
              className="text-sm text-gray-500 dark:text-dark-400 truncate transition-colors duration-300"
              title={employee.email}
            >
              {employee.email}
            </p>
            <p className="text-xs text-gray-400 dark:text-dark-500 transition-colors duration-300">
              NIK: {employee.nik}
            </p>
          </div>
        </div>
        <div className="relative">
          <button className="p-1 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-all duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Employee details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-dark-400 transition-colors duration-300">
            Posisi:
          </span>
          <span
            className="text-sm font-medium text-gray-900 dark:text-dark-100 truncate max-w-32 transition-colors duration-300"
            title={employee.position}
          >
            {employee.position}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-dark-400 transition-colors duration-300">
            Divisi:
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium truncate max-w-24 border transition-all duration-300 ${getDivisionBadgeColor(
              employee.division
            )}`}
            title={employee.division}
          >
            {employee.division}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-dark-400 transition-colors duration-300">
            Status:
          </span>
          <span
            className={`text-sm font-medium transition-colors duration-300 ${getStatusColor(
              employee.status
            )}`}
          >
            {employee.status}
          </span>
        </div>
      </div>

      {/* Quick contact actions */}
      <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100 dark:border-dark-600 transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleContactClick("email")}
            className="p-2 text-gray-400 dark:text-dark-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            title="Kirim Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleContactClick("phone")}
            className="p-2 text-gray-400 dark:text-dark-500 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            title="Hubungi via Telepon"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-400 dark:text-dark-500 transition-colors duration-300">
          NIK: {employee.nik}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-100 dark:border-dark-600 transition-colors duration-300 overflow-visible">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDetailClick}
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>Detail</span>
          </button>
          <button
            onClick={handleEditClick}
            className="flex items-center space-x-1 text-gray-600 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-700 px-2 py-1 rounded transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
        {employee.status === "Nonaktif" ? (
          <button
            onClick={handleActivateClick}
            className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded transition-all duration-200"
          >
            <span>Aktifkan</span>
          </button>
        ) : (
          <button
            onClick={handleDeactivateClick}
            className={`flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-all duration-200 whitespace-nowrap`}
          >
            <UserX className="w-4 h-4" />
            <span>Nonaktifkan</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
