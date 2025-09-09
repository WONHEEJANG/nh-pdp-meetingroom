import React from 'react';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateSelect: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-3">날짜</label>
      <button
        onClick={onDateSelect}
        className="w-full p-4 bg-white rounded-xl flex items-center justify-between"
        style={{ border: '1px solid var(--color-gray-200)' }}
      >
        <span className="text-lg font-medium text-gray-900">{selectedDate}</span>
        <Calendar className="w-6 h-6 text-gray-900" />
      </button>
    </div>
  );
};
