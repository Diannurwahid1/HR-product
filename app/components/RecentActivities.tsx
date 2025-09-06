import React from 'react';

const RecentActivities: React.FC = () => {
  const activities = [
    {
      id: 1,
      name: 'Eleanor Maggie',
      role: 'UI/UX Designer',
      status: 'Sakit',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 2,
      name: 'Kevin Malone',
      role: 'UI/UX Designer',
      status: 'Cuti Tahunan',
      avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 3,
      name: 'Jeremy Convoy',
      role: 'Desain Grafis',
      status: 'Kerja Dari Rumah',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-600 transition-colors duration-300 dark-transition">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-2">Apa yang terjadi di Januari?</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors duration-200">
            Cuti
          </button>
          <button className="px-4 py-2 text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg text-sm font-medium transition-colors duration-200">
            Ulang Tahun
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 dark-transition">
            <img
              src={activity.avatar}
              alt={activity.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-dark-100 truncate" title={activity.name}>
                {activity.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-400 truncate" title={`${activity.role} • ${activity.status}`}>
                {activity.role} • {activity.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;