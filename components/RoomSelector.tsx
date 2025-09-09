import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Room } from '../types';

interface RoomSelectorProps {
  selectedRoom: string;
  onRoomSelect: () => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  selectedRoom,
  onRoomSelect,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-3">장소</label>
      <button
        onClick={onRoomSelect}
        className="w-full p-4 bg-white rounded-xl flex items-center justify-between"
        style={{ border: '1px solid var(--color-gray-200)' }}
      >
        <div className="text-left">
          <div className="text-lg font-medium text-gray-900">{selectedRoom}</div>
          <div className="text-sm text-gray-500">최대 6명</div>
        </div>
        <ChevronDown className="w-6 h-6 text-gray-900" />
      </button>
    </div>
  );
};
