import React from 'react';

interface TimeSlotGridProps {
  timeSlots: string[][];
  selectedTimes: string[];
  onTimeToggle: (time: string) => void;
  getTimeSlotStatus: (time: string) => 'available' | 'selected' | 'disabled';
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  timeSlots,
  selectedTimes,
  onTimeToggle,
  getTimeSlotStatus,
}) => {
  return (
    <div className="overflow-x-hidden">
      <label className="block text-sm font-medium text-gray-600 mb-3">시간</label>
      <div className="space-y-3">
        {timeSlots.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 flex-wrap">
            {row.map((time) => {
              const status = getTimeSlotStatus(time);
              return (
                <button
                  key={time}
                  onClick={() => (status === 'available' || status === 'selected') && onTimeToggle(time)}
                  disabled={status === 'disabled'}
                  className={`
                    time-slot
                    ${status === 'selected' 
                      ? 'time-slot-selected' 
                      : status === 'disabled'
                      ? 'time-slot-disabled'
                      : 'time-slot-available'
                    }
                    active:scale-95 transition-transform
                  `}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
