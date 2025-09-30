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
  // 오늘 날짜를 컴포넌트 마운트 시 한 번만 계산하고 고정
  const [today] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
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

  // 캘린더 렌더링 후 0.5초 뒤에 오늘 날짜 자동 선택
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedDate) {
        // 고정된 오늘 날짜 사용
        handleDateSelect(today)
      }
    }, 300) // 0.3초 후

    return () => clearTimeout(timer)
  }, [today]) // today를 의존성에 추가



  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    
    // 회의실 탭으로 스크롤 애니메이션 (위에 50px 여백)
    setTimeout(() => {
      const roomTabsElement = document.getElementById('room-tabs')
      if (roomTabsElement) {
        const elementTop = roomTabsElement.offsetTop
        const scrollPosition = elementTop - 50 // 50px 여백
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const handleRoomSelect = (roomNumber: number) => {
    setSelectedRoom(roomNumber)
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
      // 예약 정보를 URL 파라미터로 전달하여 /booking/step1 페이지로 이동
      const roomName = `회의실 ${selectedRoom}`
      const dateStr = `${selectedDate.getFullYear()}. ${selectedDate.getMonth() + 1}. ${selectedDate.getDate()}.`
      
      const params = new URLSearchParams({
        room: roomName,
        date: dateStr
      })
      
      router.push(`/booking/step1?${params.toString()}`)
    }
  }



  return (
    <div className="min-h-screen bg-white w-full max-w-md mx-auto px-6 pt-[50px] pb-32">
      {/* Header */}
      <Header 
        onHome={handleHome}
        onMenu={handleMenu}
        title="예약현황"
      />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Calendar */}
        <Calendar 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          today={today}
        />

        {/* Room Tabs - 날짜 선택 시에만 표시 */}
        {selectedDate && (
          <div id="room-tabs">
            <RoomTabs 
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
            />
          </div>
        )}

        {/* Room Info - 날짜 선택 시에만 표시 */}
        {selectedDate && (
          <RoomInfo 
            selectedRoom={selectedRoom}
          />
        )}

        {/* Reservation Status - 날짜 선택 시에만 표시 */}
        {selectedDate && (
          <ReservationStatus 
            reservations={reservations}
            selectedDate={selectedDate}
            selectedRoom={selectedRoom}
            loading={loading}
          />
        )}

      </div>

      {/* Action Buttons - 날짜 선택 시에만 표시 */}
      {selectedDate && (
        <ActionButtons 
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          disabled={!selectedDate}
        />
      )}
    </div>
  )
}
