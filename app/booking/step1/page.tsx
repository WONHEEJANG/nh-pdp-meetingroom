'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { reservationService, Reservation } from '@/lib/supabase'
import Header from '@/components/Header'
import RoomTabs from '@/components/RoomTabs'
import RoomInfo from '@/components/RoomInfo'
import TimeSlotGrid from '@/components/TimeSlotGrid'
import ActionButtons from '@/components/ActionButtons'
import Calendar from '@/components/Calendar'

export default function BookingStep1Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL에서 전달받은 초기값 설정
  const initialRoom = searchParams.get('room') || '회의실 1'
  const initialDate = searchParams.get('date') || ''
  
  // Room selection state
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const roomNumber = initialRoom.match(/\d+/)?.[0]
    return roomNumber ? parseInt(roomNumber) : 1
  })
  
  // Date selection state
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (initialDate) {
      // "2025. 1. 15." 형식을 Date 객체로 변환
      const parts = initialDate.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\./)
      if (parts) {
        const year = parseInt(parts[1])
        const month = parseInt(parts[2]) - 1 // JavaScript Date는 0부터 시작
        const day = parseInt(parts[3])
        return new Date(year, month, day)
      }
    }
    return new Date()
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  
  // TimeSlotGrid 관련 state
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(() => {
    const timeSlotsParam = searchParams.get('timeSlots')
    return timeSlotsParam ? timeSlotsParam.split(',') : []
  })
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([])
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

  const calculateBookedTimeSlots = (reservations: Reservation[], room: string, date: string) => {
    const bookedSlots: string[] = []
    
    console.log('🔍 calculateBookedTimeSlots - Input:', { room, date })
    
    reservations.forEach(reservation => {
      console.log('📊 Reservation check:', {
        originalDate: reservation.date,
        reservationRoom: reservation.room,
        targetRoom: room,
        targetDate: date,
        roomMatch: reservation.room === room,
        dateMatch: reservation.date === date,
        time: reservation.time
      })
      
      if (reservation.room === room && reservation.date === date) {
        // 시간 문자열을 파싱하여 30분 단위 슬롯으로 변환
        const timeSlots = parseTimeRange(reservation.time)
        console.log('⏰ Time slots parsed:', timeSlots)
        bookedSlots.push(...timeSlots)
      }
    })
    
    console.log('✅ Final booked slots:', bookedSlots)
    return bookedSlots
  }

  // 시간 범위를 30분 단위 슬롯으로 파싱
  const parseTimeRange = (timeRange: string): string[] => {
    const slots: string[] = []
    
    // "09:00-10:30" 또는 "09:00 - 10:30" 형식 처리
    const ranges = timeRange.split(',').map(range => range.trim())
    
    ranges.forEach(range => {
      const [start, end] = range.split(/[-~]/).map(t => t.trim())
      if (start && end) {
        const startMinutes = timeToMinutes(start)
        const endMinutes = timeToMinutes(end)
        
        // 30분 단위로 슬롯 생성
        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
          slots.push(minutesToTime(minutes))
        }
      }
    })
    
    return slots
  }

  // 시간을 분으로 변환
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // 분을 시간으로 변환
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // 컴포넌트 마운트 시 스크롤을 맨 위로 초기화 및 예약 데이터 가져오기
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchReservations()
  }, [])

  // 예약 데이터가 변경될 때 예약된 시간 슬롯 업데이트
  useEffect(() => {
    if (selectedDate) {
      const dateString = formatDate(selectedDate)
      const booked = calculateBookedTimeSlots(reservations, `회의실 ${selectedRoom}`, dateString)
      console.log('📅 Booking - Selected Date:', dateString)
      console.log('🏢 Booking - Selected Room:', `회의실 ${selectedRoom}`)
      console.log('📋 Booking - Reservations:', reservations)
      console.log('🚫 Booking - Booked Time Slots:', booked)
      setBookedTimeSlots(booked)
    } else {
      setBookedTimeSlots([])
    }
  }, [reservations, selectedDate, selectedRoom])

  // 회의실이 변경될 때 선택된 시간 슬롯 초기화
  useEffect(() => {
    setSelectedTimeSlots([])
  }, [selectedRoom])

  const handleTimeSlotSelect = (time: string) => {
    // 예약된 시간 슬롯은 선택할 수 없음
    if (bookedTimeSlots.includes(time)) {
      return
    }
    
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time)
      } else {
        return [...prev, time].sort()
      }
    })
  }

  const handleBack = () => {
    router.push('/')
  }

  const handleDateInputClick = () => {
    setShowDatePicker(true)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // 바텀시트는 닫지 않고 확인 버튼을 눌러야 닫힘
  }

  const handleDatePickerClose = () => {
    setShowDatePicker(false)
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}. ${month}. ${day}.`
  }

  const handleNext = () => {
    // 시간 슬롯 선택 검증
    if (selectedTimeSlots.length === 0) {
      alert('예약할 시간을 선택해주세요.')
      return
    }

    if (selectedDate) {
      // Step 2로 이동하면서 선택된 정보를 URL 파라미터로 전달
      const roomName = `회의실 ${selectedRoom}`
      const dateStr = formatDate(selectedDate)
      
      const params = new URLSearchParams({
        room: roomName,
        date: dateStr,
        timeSlots: selectedTimeSlots.join(',')
      })
      
      router.push(`/booking/step2?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-md mx-auto px-6 pt-[50px] pb-32">
      {/* Header */}
      <Header onBack={handleBack} title="회의실 예약" />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Page Title */}
        <div className="mb-6" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <h2 
            className="text-[#121212]"
            style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '22px', letterSpacing: '-0.44px', lineHeight: '32px' }}
          >
            예약 정보를 입력해 주세요
          </h2>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <div className="mb-2">
            <span 
              className="text-[#505050]"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
            >
              날짜
            </span>
          </div>
          <button 
            onClick={handleDateInputClick}
            className="w-full bg-white border border-[#e1e1e1] rounded-xl flex items-center" 
            style={{ height: '54px', paddingLeft: '20px', paddingRight: '20px' }}
          >
            <span 
              className="text-[#121212] flex-1 text-left"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px' }}
            >
              {selectedDate ? formatDate(selectedDate) : '날짜를 선택해주세요'}
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5M16 2V5M3.5 9.09H20.5M5 19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V19Z" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Room Selection */}
        <RoomTabs 
          selectedRoom={selectedRoom}
          onRoomSelect={(room) => {
            setSelectedRoom(room)
            setSelectedTimeSlots([]) // 회의실 변경 시 선택된 시간 슬롯 초기화
          }}
        />

        {/* Room Info */}
        <RoomInfo selectedRoom={selectedRoom} />

        {/* Time Slot Grid */}
        <div className="mb-6">
          <TimeSlotGrid 
            selectedSlots={selectedTimeSlots}
            onSlotSelect={handleTimeSlotSelect}
            bookedSlots={bookedTimeSlots}
            loading={loading}
          />
        </div>
      </div>

      {/* Action Button - Fixed at bottom */}
      <ActionButtons
        onConfirm={handleNext}
        disabled={selectedTimeSlots.length === 0}
        confirmText="다음"
        showCancel={false}
      />

      {/* Date Picker Bottom Sheet */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-t-3xl w-full max-w-md mx-auto transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom-4"
            style={{ height: '490px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ height: '60px' }}>
              <h3 
                className="text-[#121212]"
                style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.4px', lineHeight: '28px' }}
              >
                날짜를 선택해 주세요
              </h3>
              <button 
                onClick={handleDatePickerClose}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Calendar Content */}
            <div className="px-6 pb-6">
              <Calendar 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* Confirm Button */}
            <div className="px-6 pb-6">
              <button
                onClick={handleDatePickerClose}
                className="w-full bg-[#19973c] text-white rounded-xl transition-colors touch-manipulation"
                style={{ 
                  fontFamily: 'Pretendard', 
                  fontWeight: 500, 
                  fontSize: '18px', 
                  letterSpacing: '-0.36px', 
                  lineHeight: '26px',
                  height: '56px'
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
