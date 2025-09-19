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
  bookedSlots: string[]
  loading?: boolean
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ selectedSlots, onSlotSelect, bookedSlots, loading = false }) => {
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isSelected = selectedSlots.includes(time)
        const isBooked = bookedSlots.includes(time)
        
        slots.push({
          time,
          available: !isBooked, // 예약된 슬롯은 사용 불가
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
    if (loading) return
    onSlotSelect(time)
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center py-8">
          <div className="text-[#767676]" style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
            예약 정보를 불러오는 중
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 mb-2" style={{ height: '30px' }}>
          {row.map((slot) => {
            const isBooked = bookedSlots.includes(slot.time)
            return (
              <button
                key={slot.time}
                onClick={() => handleSlotClick(slot.time)}
                disabled={!slot.available || loading}
                className={`flex-1 rounded-full transition-colors touch-manipulation ${
                  slot.selected
                    ? 'bg-[#111111] text-white'
                    : slot.available
                    ? 'bg-white border border-[#d3d3d3] text-[#121212] hover:bg-gray-50 active:bg-gray-100'
                    : 'bg-[#f6f6f6] text-[#767676] cursor-not-allowed'
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
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default TimeSlotGrid
