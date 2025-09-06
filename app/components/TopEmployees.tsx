import React from 'react';
import { showInfo } from '../utils/alerts';

const TopEmployees: React.FC = () => {
  const employees = [
    {
      id: 1,
      name: 'Brooklyn Simmons',
      email: 'brook.simmons@gmail.com',
      department: 'Desain',
      departmentColor: 'bg-green-100 text-green-800',
      kpi: '80%',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 2,
      name: 'Cody Fisher',
      email: 'cody.fisher@gmail.com',
      department: 'Pengembangan',
      departmentColor: 'bg-blue-100 text-blue-800',
      kpi: '200%',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 3,
      name: 'Ralph Edwards',
      email: 'ralph.edwards@gmail.com',
      department: 'Marketing',
      departmentColor: 'bg-purple-100 text-purple-800',
      kpi: '95%',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-600 transition-colors duration-300 dark-transition">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Top Karyawan/KPI</h2>
        <button 
          onClick={() => showInfo('Membuka halaman detail KPI semua karyawan')}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200"
        >
          Lihat Detail
        </button>
      </div>

      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-dark-400 border-b border-gray-200 dark:border-dark-600 pb-2">
          <div className="col-span-5">Nama Karyawan</div>
          <div className="col-span-4">Departemen</div>
          <div className="col-span-3">KPI</div>
        </div>

        {/* Employee List */}
        {employees.map((employee) => (
          <div key={employee.id} className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 dark-transition">
            <div className="col-span-5 flex items-center space-x-3">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-dark-100 truncate" title={employee.name}>
                  {employee.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-400 truncate" title={employee.email}>
                  {employee.email}
                </p>
              </div>
            </div>
            <div className="col-span-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium truncate max-w-full ${employee.departmentColor} dark:bg-opacity-20`} title={employee.department}>
                {employee.department}
              </span>
            </div>
            <div className="col-span-3">
              <span className="font-semibold text-gray-900 dark:text-dark-100 truncate" title={employee.kpi}>
                {employee.kpi}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEmployees;