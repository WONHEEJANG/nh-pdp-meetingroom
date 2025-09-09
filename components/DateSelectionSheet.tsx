import React, { useState, useEffect, useRef } from 'react';
import { BottomSheet } from './BottomSheet';

interface DateSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect?: (date: string) => void;
}

// 오늘 날짜를 가져오는 함수
const getTodayDate = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  };
};

export const DateSelectionSheet: React.FC<DateSelectionSheetProps> = ({
  isOpen,
  onClose,
  onDateSelect,
}) => {
  const today = getTodayDate();
  const [selectedYear, setSelectedYear] = useState(today.year);
  const [selectedMonth, setSelectedMonth] = useState(today.month);
  const [selectedDay, setSelectedDay] = useState(today.day);

  const years = Array.from({ length: 8 }, (_, i) => 2021 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  // 바텀시트가 열릴 때 오늘 날짜로 스크롤 이동
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        // 년도 스크롤
        if (yearRef.current) {
          const yearIndex = years.indexOf(selectedYear);
          const yearButton = yearRef.current.children[yearIndex] as HTMLElement;
          if (yearButton) {
            yearButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        
        // 월 스크롤
        if (monthRef.current) {
          const monthIndex = months.indexOf(selectedMonth);
          const monthButton = monthRef.current.children[monthIndex] as HTMLElement;
          if (monthButton) {
            monthButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        
        // 일 스크롤
        if (dayRef.current) {
          const dayIndex = days.indexOf(selectedDay);
          const dayButton = dayRef.current.children[dayIndex] as HTMLElement;
          if (dayButton) {
            dayButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    }
  }, [isOpen, selectedYear, selectedMonth, selectedDay, years, months, days]);

  const handleConfirm = () => {
    const formattedDate = `${selectedYear}.${selectedMonth.toString().padStart(2, '0')}.${selectedDay.toString().padStart(2, '0')}`;
    onDateSelect?.(formattedDate);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="날짜 선택">
      <div className="flex h-64">
        {/* 년도 선택 */}
        <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar">
          <div ref={yearRef} className="space-y-2 py-8">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`w-full py-3 px-4 rounded-xl text-center transition-colors ${
                  selectedYear === year
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                {year}년
              </button>
            ))}
          </div>
        </div>

        {/* 월 선택 */}
        <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar">
          <div ref={monthRef} className="space-y-2 py-8">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`w-full py-3 px-4 rounded-xl text-center transition-colors ${
                  selectedMonth === month
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                {month}월
              </button>
            ))}
          </div>
        </div>

        {/* 일 선택 */}
        <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar">
          <div ref={dayRef} className="space-y-2 py-8">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`w-full py-3 px-4 rounded-xl text-center transition-colors ${
                  selectedDay === day
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                {day}일
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleConfirm}
          className="btn-primary w-full"
        >
          확인
        </button>
      </div>
    </BottomSheet>
  );
};
