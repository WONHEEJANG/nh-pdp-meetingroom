'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Calendar from '@/components/Calendar'
import RoomTabs from '@/components/RoomTabs'
import RoomInfo from '@/components/RoomInfo'
import TimeSlotGrid from '@/components/TimeSlotGrid'
import ActionButtons from '@/components/ActionButtons'

export default function Home() {
  const router = useRouter()
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
    if (selectedDate && selectedTimeSlots.length > 0) {
      // 예약 정보를 URL 파라미터로 전달하여 /booking 페이지로 이동
      const roomName = `회의실 ${selectedRoom}`
      const dateStr = `${selectedDate.getFullYear()}. ${selectedDate.getMonth() + 1}. ${selectedDate.getDate()}.`
      const timeStr = formatTimeSlots(selectedTimeSlots)
      
      const params = new URLSearchParams({
        room: roomName,
        date: dateStr,
        time: timeStr
      })
      
      router.push(`/booking?${params.toString()}`)
    }
  }

  // 시간 슬롯을 연속된 그룹으로 분리
  const formatTimeSlots = (slots: string[]) => {
    if (slots.length === 0) return ''
    if (slots.length === 1) return slots[0]
    
    // 시간을 분으로 변환하는 함수
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }
    
    // 분을 시간으로 변환하는 함수
    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }
    
    // 시간 슬롯을 분으로 변환하고 정렬
    const sortedSlots = slots
      .map(time => ({ time, minutes: timeToMinutes(time) }))
      .sort((a, b) => a.minutes - b.minutes)
    
    const groups: string[] = []
    let currentGroup: { start: string, end: string } | null = null
    
    for (const slot of sortedSlots) {
      if (!currentGroup) {
        // 첫 번째 슬롯 (30분 구간의 시작)
        currentGroup = { start: slot.time, end: minutesToTime(slot.minutes + 30) }
      } else {
        // 현재 그룹의 마지막 시간이 다음 슬롯의 시작 시간과 같으면 연속
        const lastEndMinutes = timeToMinutes(currentGroup.end)
        if (lastEndMinutes === slot.minutes) {
          // 연속된 구간이므로 종료 시간을 30분 연장
          currentGroup.end = minutesToTime(slot.minutes + 30)
        } else {
          // 연속이 아니면 현재 그룹을 저장하고 새 그룹 시작
          groups.push(`${currentGroup.start} - ${currentGroup.end}`)
          currentGroup = { start: slot.time, end: minutesToTime(slot.minutes + 30) }
        }
      }
    }
    
    // 마지막 그룹 추가
    if (currentGroup) {
      groups.push(`${currentGroup.start} - ${currentGroup.end}`)
    }
    
    return groups.join(', ')
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
