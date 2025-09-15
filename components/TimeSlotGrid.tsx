'use client'

import React, { useState } from 'react'

interface TimeSlot {
  time: string
  available: boolean
  selected: boolean
}

interface TimeSlotGridProps {
  selectedSlots: string[]
  onSlotSelect: (time: string) => void
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ selectedSlots, onSlotSelect }) => {
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isSelected = selectedSlots.includes(time)
        
        // 예약 불가능한 시간대 (10:00-11:30, 15:30-17:00)
        const isUnavailable = 
          (hour === 10 && minute === 0) || // 10:00
          (hour === 10 && minute === 30) || // 10:30
          (hour === 11 && minute === 0) || // 11:00
          (hour === 11 && minute === 30) || // 11:30
          (hour === 15 && minute === 30) || // 15:30
          (hour === 16 && minute === 0) || // 16:00
          (hour === 16 && minute === 30) || // 16:30
          (hour === 17 && minute === 0) // 17:00
        
        slots.push({
          time,
          available: !isUnavailable,
          selected: isSelected
        })
      }
    }
    
    return slots
  }

  const timeSlots = generateTimeSlots()
  const rows = []
  
  // 4개씩 그룹으로 나누어 행 생성
  for (let i = 0; i < timeSlots.length; i += 4) {
    rows.push(timeSlots.slice(i, i + 4))
  }

  const handleSlotClick = (time: string) => {
    onSlotSelect(time)
  }

  return (
    <div className="w-full">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 mb-2" style={{ height: '30px' }}>
          {row.map((slot) => (
            <button
              key={slot.time}
              onClick={() => handleSlotClick(slot.time)}
              disabled={!slot.available}
              className={`flex-1 rounded-full transition-colors touch-manipulation ${
                slot.selected
                  ? 'bg-[#111111] text-white'
                  : slot.available
                  ? 'bg-white border border-[#d3d3d3] text-[#121212] hover:bg-gray-50 active:bg-gray-100'
                  : 'bg-[#f6f6f6] text-[#121212] cursor-not-allowed'
              }`}
              style={{ 
                fontFamily: 'Pretendard', 
                fontWeight: slot.selected ? 500 : 400, 
                fontSize: '13px', 
                letterSpacing: '-0.26px', 
                lineHeight: '20px',
                height: '30px'
              }}
            >
              {slot.time}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TimeSlotGrid
