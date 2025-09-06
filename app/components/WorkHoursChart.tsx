import React from 'react';
import { showInfo } from '../utils/alerts';

const WorkHoursChart: React.FC = () => {
  const chartData = [
    { date: 'Jan 24', workHours: 10, overtime: 2 },
    { date: 'Jan 25', workHours: 10, overtime: 1 },
    { date: 'Jan 26', workHours: 10, overtime: 2 },
    { date: 'Jan 27', workHours: 9, overtime: 0 },
    { date: 'Jan 28', workHours: 9, overtime: 0 },
    { date: 'Jan 29', workHours: 3, overtime: 0 },
    { date: 'Jan 30', workHours: 4, overtime: 0 },
  ];

  const maxHours = 12;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-600 transition-colors duration-300 dark-transition">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Jam Kerja Anggota</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-dark-100">120</span>
            <span className="text-sm text-gray-500 dark:text-dark-400">:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-dark-100">54</span>
            <span className="text-sm text-gray-500 dark:text-dark-400">m</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">Lihat berdasarkan:</p>
          <select 
            onChange={(e) => showInfo(`Filter berubah ke: ${e.target.value}`)}
            className="text-sm border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option>Minggu</option>
            <option>Bulan</option>
            <option>Tahun</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end justify-between space-x-2 h-48">
          {chartData.map((data, index) => {
            const totalHeight = ((data.workHours + data.overtime) / maxHours) * 100;
            const workHeight = (data.workHours / maxHours) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full h-40 flex items-end">
                  <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-t">
                    <div 
                      className="w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-300"
                      style={{ height: `${totalHeight}%` }}
                    >
                      {data.overtime > 0 && (
                        <div 
                          className="w-full bg-red-400 dark:bg-red-500 rounded-t"
                          style={{ height: `${(data.overtime / (data.workHours + data.overtime)) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-dark-400 mt-2">{data.date}</p>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-400 dark:text-dark-500">
          <span>12</span>
          <span>10</span>
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-dark-300">Waktu Kerja</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 dark:bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-dark-300">Lembur</span>
        </div>
      </div>
    </div>
  );
};

export default WorkHoursChart;