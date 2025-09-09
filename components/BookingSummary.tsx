import React from 'react';

interface BookingSummaryProps {
  selectedRoom: string;
  selectedDate: string;
  timeRange: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedRoom,
  selectedDate,
  timeRange,
}) => {
  return (
    <div className="card mb-8">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">장소</span>
          <span className="font-medium">{selectedRoom}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">날짜</span>
          <span className="font-medium">{selectedDate}</span>
        </div>
        <div className="flex items-start">
          <span className="text-gray-600 w-12 flex-shrink-0">시간</span>
          <span className="font-medium text-right flex-1" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>{timeRange}</span>
        </div>
      </div>
    </div>
  );
};
