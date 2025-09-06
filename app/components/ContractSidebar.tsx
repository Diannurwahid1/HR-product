import React from 'react';
import { X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { showSuccess } from '../utils/alerts';

interface ContractSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContractSidebar: React.FC<ContractSidebarProps> = ({ isOpen, onClose }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = currentDate.getDate();

  const upcomingContracts = [
    {
      id: 1,
      name: 'Dewi Lestari',
      position: 'Front-End Developer',
      daysLeft: 14,
      status: 'Perpanjangan'
    },
    {
      id: 2,
      name: 'Ahmad Rizki',
      position: 'Back-End Developer',
      daysLeft: 28,
      status: 'Perpanjangan'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      position: 'UI/UX Designer',
      daysLeft: 0,
      status: 'Perpanjangan'
    }
  ];

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft === 0) return 'text-red-600';
    if (daysLeft <= 14) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getStatusText = (daysLeft: number) => {
    if (daysLeft === 0) return 'Hari ini';
    return `${daysLeft} hari`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Kalender Kontrak</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{currentMonth}</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`text-center text-sm py-2 rounded ${
                    day === null
                      ? ''
                      : day === today
                      ? 'bg-blue-600 text-white font-medium'
                      : day === 13 || day === 14 || day === 28
                      ? 'bg-yellow-100 text-yellow-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${day !== null ? 'cursor-pointer' : ''}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Contracts */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-medium text-gray-900">Kontrak Berakhir Segera</h3>
            </div>
            
            <div className="space-y-3">
              {upcomingContracts.map((contract) => (
                <div key={contract.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{contract.name}</p>
                      <p className="text-xs text-gray-500">{contract.position}</p>
                    </div>
                    <span className={`text-xs font-medium ${getStatusColor(contract.daysLeft)}`}>
                      {getStatusText(contract.daysLeft)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {contract.status}
                    </span>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      <span onClick={() => alert(`Pengingat dikirim untuk kontrak ${contract.name}`)}>
                        <span onClick={() => showSuccess(`Pengingat dikirim untuk kontrak ${contract.name}`)}>
                          Ingatkan
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractSidebar;