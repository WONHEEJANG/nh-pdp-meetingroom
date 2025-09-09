import React from 'react';
import { Room } from '../types';
import { BottomSheet } from './BottomSheet';

interface RoomSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoom: string;
  onRoomSelect: (roomName: string) => void;
}

export const RoomSelectionSheet: React.FC<RoomSelectionSheetProps> = ({
  isOpen,
  onClose,
  rooms,
  selectedRoom,
  onRoomSelect,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="회의실 선택">
      <div className="space-y-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => {
              onRoomSelect(room.name);
              onClose();
            }}
            className={`w-full p-4 rounded-xl text-left transition-colors ${
              selectedRoom === room.name 
                ? 'text-green-600 font-semibold' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
