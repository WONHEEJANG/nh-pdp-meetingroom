import React from 'react';
import { Header } from '../Header';
import { RoomSelector } from '../RoomSelector';
import { DateSelector } from '../DateSelector';
import { TimeSlotGrid } from '../TimeSlotGrid';
import { Room } from '../../types';

interface TimeSelectionScreenProps {
  selectedRoom: string;
  selectedDate: string;
  selectedTimes: string[];
  timeSlots: string[][];
  onRoomSelect: () => void;
  onDateSelect: () => void;
  onTimeToggle: (time: string) => void;
  getTimeSlotStatus: (time: string) => 'available' | 'selected' | 'disabled';
  onNext: () => void;
}

export const TimeSelectionScreen: React.FC<TimeSelectionScreenProps> = ({
  selectedRoom,
  selectedDate,
  selectedTimes,
  timeSlots,
  onRoomSelect,
  onDateSelect,
  onTimeToggle,
  getTimeSlotStatus,
  onNext,
}) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <Header title="회의실 예약" showRightIcons={false} />
      
      <div className="pt-20 px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          예약정보를 선택해주세요
        </h1>
      </div>

      <div className="px-6 space-y-6 pb-32">
        <RoomSelector selectedRoom={selectedRoom} onRoomSelect={onRoomSelect} />
        <DateSelector selectedDate={selectedDate} onDateSelect={onDateSelect} />
        <TimeSlotGrid
          timeSlots={timeSlots}
          selectedTimes={selectedTimes}
          onTimeToggle={onTimeToggle}
          getTimeSlotStatus={getTimeSlotStatus}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent">
        <button
          onClick={onNext}
          disabled={selectedTimes.length === 0}
          className="btn-primary w-full disabled:bg-gray-300"
        >
          예약하기
        </button>
      </div>

    </div>
  );
};
