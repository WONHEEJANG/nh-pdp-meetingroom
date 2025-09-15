'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Calendar from '@/components/Calendar'
import RoomTabs from '@/components/RoomTabs'
import RoomInfo from '@/components/RoomInfo'
import TimeSlotGrid from '@/components/TimeSlotGrid'
import ActionButtons from '@/components/ActionButtons'

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null) // 초기에는 선택된 날짜 없음
  const [selectedRoom, setSelectedRoom] = useState<number>(1)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    
    // 회의실 탭으로 스크롤 애니메이션
    setTimeout(() => {
      const roomTabsElement = document.getElementById('room-tabs')
      if (roomTabsElement) {
        roomTabsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
    }, 100)
  }

  const handleRoomSelect = (roomNumber: number) => {
    setSelectedRoom(roomNumber)
  }

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time)
      } else {
        return [...prev, time].sort()
      }
    })
  }

  const handleBack = () => {
    console.log('뒤로가기')
  }

  const handleHome = () => {
    console.log('홈')
  }

  const handleMenu = () => {
    console.log('메뉴')
  }

  const handleCancel = () => {
    console.log('예약취소')
    setSelectedTimeSlots([])
  }

  const handleConfirm = () => {
    console.log('예약하기', {
      date: selectedDate,
      room: selectedRoom,
      timeSlots: selectedTimeSlots
    })
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-md mx-auto px-6 pt-[50px] pb-32">
      {/* Header */}
      <Header 
        onBack={handleBack}
        onHome={handleHome}
        onMenu={handleMenu}
      />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Calendar */}
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* Room Tabs */}
        <div id="room-tabs">
          <RoomTabs 
            selectedRoom={selectedRoom}
            onRoomSelect={handleRoomSelect}
          />
        </div>

        {/* Room Info */}
        <RoomInfo 
          capacity={10}
          features={['영상기기 연결 지원']}
        />

        {/* Time Slot Grid */}
        <TimeSlotGrid 
          selectedSlots={selectedTimeSlots}
          onSlotSelect={handleTimeSlotSelect}
        />

      </div>

      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons 
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        disabled={!selectedDate || selectedTimeSlots.length === 0}
      />
    </div>
  )
}
