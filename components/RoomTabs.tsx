'use client'

import React from 'react'

interface RoomTabsProps {
  selectedRoom: number
  onRoomSelect: (roomNumber: number) => void
}

const RoomTabs: React.FC<RoomTabsProps> = ({ selectedRoom, onRoomSelect }) => {
  const rooms = [
    { id: 1, name: '회의실 1' },
    { id: 2, name: '회의실 2' },
    { id: 3, name: '회의실 3' }
  ]

  return (
    <div className="w-full bg-white border-b border-[#e1e1e1]" style={{ height: '48px' }}>
      <div className="flex" style={{ height: '48px' }}>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`flex-1 flex items-center justify-center border-b-2 touch-manipulation ${
              selectedRoom === room.id
                ? 'border-[#111111]'
                : 'border-transparent'
            }`}
            style={{ height: '48px' }}
          >
            <span 
              className={`${
                selectedRoom === room.id
                  ? 'text-[#121212]'
                  : 'text-[#505050]'
              }`}
              style={{ 
                fontFamily: 'Pretendard', 
                fontWeight: selectedRoom === room.id ? 600 : 400, 
                fontSize: '16px', 
                letterSpacing: '-0.32px', 
                lineHeight: '24px' 
              }}
            >
              {room.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default RoomTabs
