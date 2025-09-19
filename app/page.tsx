'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Calendar from '@/components/Calendar'
import RoomTabs from '@/components/RoomTabs'
import RoomInfo from '@/components/RoomInfo'
import ReservationStatus from '@/components/ReservationStatus'
import ActionButtons from '@/components/ActionButtons'
import { reservationService, Reservation } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null) // 초기에는 선택된 날짜 없음
  const [selectedRoom, setSelectedRoom] = useState<number>(1)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)

  // 예약 데이터 가져오기
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getReservations()
      setReservations(data || [])
    } catch (error) {
      console.error('예약 데이터 가져오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }


  // 컴포넌트 마운트 시 예약 데이터 가져오기
  useEffect(() => {
    fetchReservations()
  }, [])

  // 페이지 포커스 시 예약 데이터 새로고침 (예약 완료 후 돌아올 때)
  useEffect(() => {
    const handleFocus = () => {
      fetchReservations()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])


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
    // Navigate to cancel page
    router.push('/cancel')
  }

  const handleConfirm = () => {
    if (selectedDate) {
      // 예약 정보를 URL 파라미터로 전달하여 /booking 페이지로 이동
      const roomName = `회의실 ${selectedRoom}`
      const dateStr = `${selectedDate.getFullYear()}. ${selectedDate.getMonth() + 1}. ${selectedDate.getDate()}.`
      
      const params = new URLSearchParams({
        room: roomName,
        date: dateStr
      })
      
      router.push(`/booking?${params.toString()}`)
    }
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
          selectedRoom={selectedRoom}
        />

        {/* Reservation Status */}
        <ReservationStatus 
          reservations={reservations}
          selectedDate={selectedDate}
          selectedRoom={selectedRoom}
          loading={loading}
        />

      </div>

      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons 
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        disabled={!selectedDate}
      />
    </div>
  )
}
