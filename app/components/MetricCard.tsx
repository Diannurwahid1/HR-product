import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  bgColor?: string;
  textColor?: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  icon?: React.ComponentType<any>;
  description?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  bgColor = 'bg-white dark:bg-dark-800', 
  textColor = 'text-gray-900 dark:text-dark-100',
  change,
  icon: Icon,
  description,
  className = ''
}) => {
  const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="w-4 h-4" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20 dark:text-success-400';
      case 'decrease':
        return 'text-error-600 bg-error-50 dark:bg-error-900/20 dark:text-error-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className={`
      ${bgColor} 
      rounded-2xl p-6 
      border border-gray-200 dark:border-dark-600 
      shadow-sm hover:shadow-lg 
      transition-all duration-300 
      hover:scale-105 hover:-translate-y-1
      group cursor-pointer
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-dark-400 mb-1 group-hover:text-gray-700 dark:group-hover:text-dark-300 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-dark-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className={`text-3xl font-bold ${textColor} group-hover:scale-105 transition-transform duration-300 origin-left`}>
          {value}
        </p>
      </div>

      {/* Change Indicator */}
      {change && (
        <div className="flex items-center space-x-2">
          <div className={`
            flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium
            ${getTrendColor(change.type)}
            transition-all duration-300
          `}>
            {getTrendIcon(change.type)}
            <span>{change.value}</span>
          </div>
          {change.period && (
            <span className="text-xs text-gray-500 dark:text-dark-500">
              {change.period}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;