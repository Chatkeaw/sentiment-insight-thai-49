import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthlyComparisonProps {
  currentValue: number;
  previousValue: number;
  format?: 'number' | 'percentage' | 'currency';
  suffix?: string;
}

export const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({
  currentValue,
  previousValue,
  format = 'number',
  suffix = ''
}) => {
  const difference = currentValue - previousValue;
  const percentageChange = previousValue !== 0 ? (difference / previousValue) * 100 : 0;
  
  const formatValue = (value: number) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const isPositive = difference > 0;
  const isNegative = difference < 0;
  const isNeutral = difference === 0;

  const getIcon = () => {
    if (isPositive) return <TrendingUp className="w-3 h-3" />;
    if (isNegative) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getColorClass = () => {
    if (isPositive) return 'text-emerald-600 bg-emerald-50';
    if (isNegative) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="text-xs text-muted-foreground">
        เดือนที่แล้ว: {formatValue(previousValue)}{suffix}
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColorClass()}`}>
        {getIcon()}
        <span>
          {isNeutral ? '0%' : `${isPositive ? '+' : ''}${percentageChange.toFixed(1)}%`}
        </span>
      </div>
    </div>
  );
};