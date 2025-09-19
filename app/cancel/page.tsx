'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { reservationService, Reservation } from '@/lib/supabase'
import Calendar from '@/components/Calendar'

interface CancelData {
  room: string
  date: string
  time: string
}

export default function CancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) // 오늘 날짜로 초기화
  const [selectedRoom, setSelectedRoom] = useState<number>(1)
  const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{id: string, time: string}[]>([])
  const [password, setPassword] = useState('')
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showPasswordErrorModal, setShowPasswordErrorModal] = useState(false)

  // 컴포넌트 마운트 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 예약 데이터 가져오기
  useEffect(() => {
    fetchReservations()
  }, [])

  // 날짜나 회의실이 변경될 때 예약된 시간 슬롯 업데이트
  useEffect(() => {
    if (selectedDate) {
      const booked = calculateBookedTimeSlots(reservations, selectedRoom, selectedDate)
      // 예약 목록은 이미 filteredReservations에서 처리됨
    }
  }, [selectedDate, selectedRoom, reservations])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getReservations()
      setReservations(data)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  // 예약된 시간 슬롯 계산 (홈 페이지와 동일한 로직)
  const calculateBookedTimeSlots = (reservations: any[], room: number, date: Date) => {
    const roomName = `회의실 ${room}`
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD 형식
    
    return reservations
      .filter(reservation => 
        reservation.room === roomName && 
        reservation.date === dateStr
      )
      .map(reservation => reservation.time)
      .flat()
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

  // 시간을 30분 단위로 파싱하는 함수
  const parseTimeSlots = (timeRange: string, reserverName: string, reservationId: string) => {
    const slots: { time: string, reserver: string, id: string }[] = []
    
    // "09:00 - 10:00" 형식을 파싱
    const [start, end] = timeRange.split(' - ').map(t => t.trim())
    if (start && end) {
      const startMinutes = timeToMinutes(start)
      const endMinutes = timeToMinutes(end)
      
      // 30분 단위로 슬롯 생성
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        slots.push({
          time: `${minutesToTime(minutes)} - ${minutesToTime(minutes + 30)}`,
          reserver: reserverName,
          id: reservationId
        })
      }
    }
    
    return slots
  }

  // 선택된 날짜와 회의실에 해당하는 예약 목록 필터링
  const filteredReservations = reservations.filter(reservation => {
    if (!selectedDate) return false
    
    // Supabase 날짜 형식: "2025. 9. 16." -> "2025-09-16"로 변환
    const formatSupabaseDate = (dateStr: string) => {
      try {
        // "2025. 9. 16." -> "2025 9 16" -> ["2025", "9", "16"]
        const cleaned = dateStr.replace(/\./g, '').trim()
        const parts = cleaned.split(/\s+/)
        
        if (parts.length === 3) {
          const year = parts[0]
          const month = parts[1].padStart(2, '0')
          const day = parts[2].padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        
        return dateStr
      } catch (error) {
        console.error('날짜 변환 오류:', error, '원본:', dateStr)
        return dateStr
      }
    }
    
    // 로컬 시간대 기준으로 YYYY-MM-DD 형식 생성
    const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    const reservationDateStr = formatSupabaseDate(reservation.date)
    const isSameDate = selectedDateStr === reservationDateStr
    const isSameRoom = reservation.room === `회의실 ${selectedRoom}`
    
    return isSameDate && isSameRoom
  })

  // 30분 단위로 변환된 예약 목록
  const timeSlotReservations = filteredReservations
    .flatMap(reservation => parseTimeSlots(reservation.time, reservation.reserver_name, reservation.id!))
    .sort((a, b) => a.time.localeCompare(b.time))

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedReservations([]) // 날짜 변경 시 선택된 예약 초기화
    setSelectedTimeSlots([]) // 날짜 변경 시 선택된 시간 슬롯 초기화
    setShowDatePicker(false) // 날짜 선택 후 바텀시트 닫기
  }

  const handleDateInputClick = () => {
    setShowDatePicker(true)
  }

  const handleDatePickerClose = () => {
    setShowDatePicker(false)
  }

  const handlePasswordErrorModalClose = () => {
    setShowPasswordErrorModal(false)
  }

  const handleRoomSelect = (room: number) => {
    setSelectedRoom(room)
    setSelectedReservations([]) // 회의실 변경 시 선택된 예약 초기화
    setSelectedTimeSlots([]) // 회의실 변경 시 선택된 시간 슬롯 초기화
  }

  const handleReservationSelect = (reservation: Reservation) => {
    setSelectedReservations(prev => {
      const isSelected = prev.some(selected => selected.id === reservation.id)
      if (isSelected) {
        return prev.filter(selected => selected.id !== reservation.id)
      } else {
        return [...prev, reservation]
      }
    })
  }

  const handleTimeSlotSelect = (slot: {id: string, time: string, reserver: string}) => {
    setSelectedTimeSlots(prev => {
      const isSelected = prev.some(selected => selected.id === slot.id && selected.time === slot.time)
      if (isSelected) {
        return prev.filter(selected => !(selected.id === slot.id && selected.time === slot.time))
      } else {
        return [...prev, { id: slot.id, time: slot.time }]
      }
    })
  }

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    if (selectedTimeSlots.length === 0) {
      alert('취소할 예약을 선택해주세요.')
      return
    }
    
    if (password.length !== 4) {
      alert('4자리 비밀번호를 입력해주세요.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 선택된 30분 슬롯들을 ID별로 그룹화
      const slotsByReservationId = selectedTimeSlots.reduce((acc, slot) => {
        if (!acc[slot.id]) {
          acc[slot.id] = []
        }
        acc[slot.id].push(slot.time)
        return acc
      }, {} as Record<string, string[]>)
      
      // 각 예약 ID에 대해 비밀번호 검증
      const reservationIds = Object.keys(slotsByReservationId)
      const passwordVerificationPromises = reservationIds.map(id => 
        reservationService.verifyReservationPassword(parseInt(id), password)
      )
      
      const passwordResults = await Promise.all(passwordVerificationPromises)
      const allPasswordsValid = passwordResults.every(isValid => isValid)
      
      if (!allPasswordsValid) {
        setShowPasswordErrorModal(true)
        setIsSubmitting(false)
        return
      }
      
      // 선택된 30분 슬롯들만 삭제 (각 예약 ID별로)
      for (const reservationId of reservationIds) {
        const timeSlots = slotsByReservationId[reservationId]
        await reservationService.deleteTimeSlots(reservationId, timeSlots)
      }
      
      // 취소 완료 후 completion 화면으로 이동
      const completionData = {
        reserverName: selectedTimeSlots.map(slot => {
          const reservation = filteredReservations.find(r => r.id === slot.id)
          return reservation?.reserver_name || ''
        }).filter((name, index, arr) => arr.indexOf(name) === index).join(', '),
        room: `회의실 ${selectedRoom}`,
        date: selectedDate ? `${selectedDate.getFullYear()}. ${selectedDate.getMonth() + 1}. ${selectedDate.getDate()}.` : '',
        time: selectedTimeSlots.map(slot => slot.time).join(', '),
        purpose: '팀 회의', // 기본값
        isCancellation: 'true'
      }
      
      const queryString = new URLSearchParams(completionData).toString()
      router.push(`/completion?${queryString}`)
      
    } catch (error) {
      console.error('❌ Error canceling reservation:', error)
      alert('예약 취소 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-md mx-auto px-6 pt-[50px] pb-32">
      {/* Header */}
      <div className="w-full bg-white flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10" style={{ height: '50px' }}>
        <button 
          onClick={handleBack}
          className="w-6 h-6 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h1 className="text-base font-semibold text-[#121212] leading-6 tracking-[-0.32px]" style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px' }}>
          예약 취소
        </h1>
        
        <div className="w-6 h-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Page Title */}
        <div className="mb-6" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <h2 
            className="text-[#121212]"
            style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '22px', letterSpacing: '-0.44px', lineHeight: '32px' }}
          >
            취소 정보를 입력해 주세요
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
        <div className="mb-6">
          <div className="flex gap-0" style={{ height: '48px' }}>
            {[1, 2, 3].map((room) => (
              <button
                key={room}
                onClick={() => handleRoomSelect(room)}
                className={`flex-1 flex items-center justify-center border-b-2 transition-colors ${
                  selectedRoom === room
                    ? 'border-[#111111] text-[#121212]'
                    : 'border-transparent text-[#505050]'
                }`}
                style={{ height: '48px' }}
              >
                <span 
                  className="text-base"
                  style={{ 
                    fontFamily: 'Pretendard', 
                    fontWeight: selectedRoom === room ? 600 : 400, 
                    fontSize: '16px', 
                    letterSpacing: '-0.32px', 
                    lineHeight: '24px' 
                  }}
                >
                  회의실 {room}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reservation List */}
        <div className="mb-6">
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <span 
                  className="text-[#767676]"
                  style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
                >
                  예약 정보를 불러오는 중...
                </span>
              </div>
            ) : timeSlotReservations.length > 0 ? (
              timeSlotReservations.map((slot, index) => (
                <button
                  key={`${slot.id}-${index}`}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`w-full rounded-xl border transition-colors ${
                    selectedTimeSlots.some(selected => selected.id === slot.id && selected.time === slot.time)
                      ? 'border-[#19973c] bg-white'
                      : 'border-[#e1e1e1] bg-white'
                  }`}
                  style={{ 
                    height: '54px', // 날짜 필드와 동일한 높이
                    paddingLeft: '20px', // 날짜 필드와 동일한 패딩
                    paddingRight: '20px' // 날짜 필드와 동일한 패딩
                  }}
                >
                  <div className="flex items-center justify-between h-full">
                    <p 
                      className={`${
                        selectedTimeSlots.some(selected => selected.id === slot.id && selected.time === slot.time) ? 'text-[#19973c]' : 'text-[#121212]'
                      }`}
                      style={{ 
                        fontFamily: 'Pretendard', 
                        fontWeight: 500, 
                        fontSize: '15px', 
                        letterSpacing: '-0.3px', 
                        lineHeight: '24px'
                      }}
                    >
                      {slot.time} / {slot.reserver}
                    </p>
                    <div className="w-6 h-6 flex items-center justify-center">
                      {selectedTimeSlots.some(selected => selected.id === slot.id && selected.time === slot.time) ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 8L10.364 16L6 12" stroke="#19973C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 8L10.364 16L6 12" stroke="#707070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <span 
                  className="text-[#767676]"
                  style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
                >
                  선택한 날짜와 회의실에 예약이 없습니다.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <div className="mb-2">
            <span 
              className="text-[#505050]"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
            >
              비밀번호
            </span>
          </div>
          <div className="w-full bg-white border border-[#e1e1e1] rounded-xl" style={{ height: '54px', paddingLeft: '20px', paddingRight: '20px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4자리 숫자 입력"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full h-full text-[#121212] placeholder-[#929292] focus:outline-none bg-white"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px' }}
            />
          </div>
        </div>
      </div>

      {/* Action Button - Fixed at bottom */}
      <div className="w-full bg-white fixed bottom-0 left-0 right-0 z-10">
        <div className="w-full bg-gradient-to-r from-white to-transparent" style={{ height: '1px' }}></div>
        <div className="w-full bg-gradient-to-b from-white to-transparent flex items-center justify-center py-6 px-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedTimeSlots.length === 0 || password.length !== 4}
            className={`w-full rounded-xl transition-colors touch-manipulation ${
              isSubmitting || selectedTimeSlots.length === 0 || password.length !== 4
                ? 'bg-[#cccccc] text-[#666666] cursor-not-allowed'
                : 'bg-[#19973c] text-white hover:bg-[#15803d] active:bg-[#166534]'
            }`}
            style={{ 
              fontFamily: 'Pretendard', 
              fontWeight: 500, 
              fontSize: '18px', 
              letterSpacing: '-0.36px', 
              lineHeight: '26px',
              height: '56px'
            }}
          >
            {isSubmitting ? '취소 중' : '예약 취소'}
          </button>
        </div>
      </div>

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

      {/* Password Error Modal */}
      {showPasswordErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl mx-6" style={{ width: '312px' }}>
            {/* Contents */}
            <div className="px-6 pb-6 pt-10">
              {/* Text */}
              <div className="text-left" style={{ marginBottom: '32px' }}>
                <p 
                  className="text-[#121212]"
                  style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '24px' }}
                >
                  비밀번호가 일치하지 않습니다.<br />
                  다시 입력해 주세요.
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handlePasswordErrorModalClose}
                className="w-full bg-white border border-[#19973c] text-[#19973c] rounded-xl transition-colors touch-manipulation flex items-center justify-center"
                style={{ 
                  fontFamily: 'Pretendard', 
                  fontWeight: 500, 
                  fontSize: '16px', 
                  letterSpacing: '-0.32px', 
                  lineHeight: '24px',
                  height: '48px',
                  minHeight: '48px'
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
