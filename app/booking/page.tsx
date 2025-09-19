'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { reservationService, Reservation } from '@/lib/supabase'
import TimeSlotGrid from '@/components/TimeSlotGrid'

interface BookingData {
  room: string
  date: string
  time: string
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [reserverName, setReserverName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([])
  const [isNoticeExpanded, setIsNoticeExpanded] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  // TimeSlotGrid 관련 state
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // URL에서 예약 데이터 가져오기
  const bookingData: BookingData = {
    room: searchParams.get('room') || '-',
    date: searchParams.get('date') || '-',
    time: searchParams.get('time') || '-'
  }

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

  // 예약된 시간 슬롯 계산
  const calculateBookedTimeSlots = (reservations: Reservation[], room: string, date: string) => {
    const bookedSlots: string[] = []
    
    reservations.forEach(reservation => {
      if (reservation.room === room && reservation.date === date) {
        // 시간 문자열을 파싱하여 30분 단위 슬롯으로 변환
        const timeSlots = parseTimeRange(reservation.time)
        bookedSlots.push(...timeSlots)
      }
    })
    
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
    if (bookingData.room && bookingData.date) {
      const booked = calculateBookedTimeSlots(reservations, bookingData.room, bookingData.date)
      setBookedTimeSlots(booked)
    } else {
      setBookedTimeSlots([])
    }
  }, [reservations, bookingData.room, bookingData.date])

  const purposeOptions = ['팀 회의', '부서 회의', '업체 미팅', '업무 회의']

  const handlePurposeSelect = (purpose: string) => {
    if (selectedPurposes.includes(purpose)) {
      setSelectedPurposes(selectedPurposes.filter(p => p !== purpose))
    } else {
      setSelectedPurposes([...selectedPurposes, purpose])
    }
    // 입력 필드에 선택된 목적을 채워넣기
    setPurpose(purpose)
  }

  const handlePurposeRemove = (purpose: string) => {
    setSelectedPurposes(selectedPurposes.filter(p => p !== purpose))
  }

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

  const toggleNotice = () => {
    setIsNoticeExpanded(!isNoticeExpanded)
  }

  const scrollToReserver = () => {
    const reserverElement = document.getElementById('reserver-section')
    if (reserverElement) {
      reserverElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
      // Fixed header height is 50px. Adjust scroll position after scrolling.
      // Using setTimeout to ensure scrollIntoView has initiated before adjusting.
      setTimeout(() => {
        window.scrollBy(0, 100)
      }, 100); // A small delay to allow smooth scroll to start
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (isSubmitting) return // 중복 제출 방지
    
    // 시간 슬롯 선택 검증
    if (selectedTimeSlots.length === 0) {
      alert('예약할 시간을 선택해주세요.')
      return
    }

    // 비밀번호 4자리 검증
    if (password.length !== 4) {
      setShowPasswordModal(true)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log('예약 시작', {
        bookingData,
        formData: {
          reserverName,
          purpose: selectedPurposes,
          password
        }
      })
      
      // 선택된 시간 슬롯을 연속된 그룹으로 포맷
      const formatTimeSlots = (slots: string[]) => {
        if (slots.length === 0) return ''
        if (slots.length === 1) return slots[0]
        
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

      // Save to Supabase
      const reservationData = {
        reserver_name: reserverName || '김농협',
        purpose: purpose || '팀 회의',
        room: bookingData.room,
        date: bookingData.date,
        time: formatTimeSlots(selectedTimeSlots),
        password: password
      }

      console.log('📤 Supabase에 데이터 전송 중...')
      const savedReservation = await reservationService.createReservation(reservationData)
      console.log('✅ Reservation saved:', savedReservation)
      
      // 데이터 삽입 완료 후 페이지 이동
      console.log('📱 Completion 페이지로 이동 중...')
      const params = new URLSearchParams({
        reserverName: reserverName || '김농협',
        purpose: purpose || '팀 회의', // 인풋필드의 실제 텍스트 사용
        room: bookingData.room,
        date: bookingData.date,
        time: formatTimeSlots(selectedTimeSlots)
      })

      router.push(`/completion?${params.toString()}`)
    } catch (error) {
      console.error('❌ Error saving reservation:', error)
      alert('예약 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsSubmitting(false) // 에러 시 로딩 상태 해제
    }
  }

  const handleModalClose = () => {
    setShowPasswordModal(false)
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
          회의실 예약
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
            예약 정보를 입력해 주세요
          </h2>
        </div>

        {/* Booking Summary */}
        <div className="w-full bg-[#f6f6f6] rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {/* 장소 */}
            <div className="flex items-center justify-between">
              <span 
                className="text-[#505050]"
                style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                장소
              </span>
              <span 
                className="text-[#121212]"
                style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {bookingData.room}
              </span>
            </div>

            {/* 날짜 */}
            <div className="flex items-center justify-between">
              <span 
                className="text-[#505050]"
                style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                날짜
              </span>
              <span 
                className="text-[#121212]"
                style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {bookingData.date}
              </span>
            </div>

          </div>
        </div>

        {/* Time Slot Grid */}
        <div className="mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-end gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-[#d3d3d3] rounded"></div>
                <span 
                  className="text-[#505050]"
                  style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '12px', letterSpacing: '0px', lineHeight: '14px' }}
                >
                  예약가능
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f6f6f6] rounded"></div>
                <span 
                  className="text-[#505050]"
                  style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '12px', letterSpacing: '0px', lineHeight: '14px' }}
                >
                  예약불가
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#121212] rounded"></div>
                <span 
                  className="text-[#505050]"
                  style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '12px', letterSpacing: '0px', lineHeight: '14px' }}
                >
                  선택
                </span>
              </div>
            </div>
          </div>
          
          <TimeSlotGrid 
            selectedSlots={selectedTimeSlots}
            onSlotSelect={handleTimeSlotSelect}
            bookedSlots={bookedTimeSlots}
            loading={loading}
          />
        </div>

        {/* 예약자 입력 */}
        <div className="mb-6">
          <div id="reserver-section" className="mb-2">
            <span 
              className="text-[#505050]"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
            >
              예약자
            </span>
          </div>
                 <div className="w-full bg-white border border-[#e1e1e1] rounded-xl" style={{ height: '54px', paddingLeft: '20px', paddingRight: '20px' }}>
                   <input
                     type="text"
                     value={reserverName}
                     onChange={(e) => setReserverName(e.target.value)}
                     onFocus={scrollToReserver}
                     placeholder="김농협"
                     className="w-full h-full text-[#121212] placeholder-[#929292] focus:outline-none bg-white"
                     style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px' }}
                   />
                 </div>
        </div>

        {/* 사용 목적 입력 */}
        <div className="mb-6">
          <div className="mb-2">
            <span 
              className="text-[#505050]"
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
            >
              사용 목적
            </span>
          </div>
                 <div className="w-full bg-white border border-[#e1e1e1] rounded-xl" style={{ height: '54px', paddingLeft: '20px', paddingRight: '20px' }}>
                   <input
                     type="text"
                     value={purpose}
                     onChange={(e) => setPurpose(e.target.value)}
                     placeholder="팀 회의"
                     className="w-full h-full text-[#121212] placeholder-[#929292] focus:outline-none bg-white"
                     style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '18px', letterSpacing: '-0.36px', lineHeight: '26px' }}
                   />
                 </div>
          
          {/* 선택된 목적들 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {purposeOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handlePurposeSelect(option)}
                className={`px-3 py-2 rounded-md transition-colors flex items-center justify-center ${
                  selectedPurposes.includes(option)
                    ? 'bg-[#f6f6f6] text-[#505050]'
                    : 'bg-[#f6f6f6] text-[#505050]'
                }`}
                style={{ 
                  fontFamily: 'Pretendard', 
                  fontWeight: 400, 
                  fontSize: '13px', 
                  letterSpacing: '-0.26px', 
                  lineHeight: '20px',
                  height: '30px'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 비밀번호 입력 */}
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
          <p 
            className="text-[#767676] mt-2"
            style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '13px', letterSpacing: '-0.26px', lineHeight: '20px' }}
          >
            예약을 취소할 경우 지금 설정한 비밀번호가 필요해요.
          </p>
        </div>

        {/* 알아두세요 섹션 */}
        <div className="w-full bg-white">
          {/* Divider */}
          <div className="w-full bg-[#f6f6f6]" style={{ height: '8px', marginLeft: '-24px', marginRight: '-24px', width: 'calc(100% + 48px)' }}></div>
          <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/icon/24/line/system/ico_notice_line_24.svg" 
                        alt="알아두세요" 
                        className="w-6 h-6"
                      />
                      <span
                        className="text-[#121212]"
                        style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px' }}
                      >
                        알아두세요
                      </span>
                    </div>
              <button 
                onClick={toggleNotice}
                className="w-6 h-6 flex items-center justify-center transition-transform duration-200"
                style={{ transform: isNoticeExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14L12 9L17 14" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          
            {isNoticeExpanded && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-[#707070] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#505050]"
                    style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
                  >
                    예약 완료 후에는 내용을 변경할 수 없습니다. 변경이 필요하면 예약을 취소하고 다시 진행해 주세요
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-[#707070] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#505050]"
                    style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px', letterSpacing: '-0.28px', lineHeight: '22px' }}
                  >
                    예약을 취소할 경우, 예약 시 설정한 비밀번호를 입력해야 합니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button - Fixed at bottom */}
      <div className="w-full bg-white fixed bottom-0 left-0 right-0 z-10">
        <div className="w-full bg-gradient-to-r from-white to-transparent" style={{ height: '1px' }}></div>
        <div className="w-full bg-gradient-to-b from-white to-transparent flex items-center justify-center py-6 px-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full rounded-xl transition-colors touch-manipulation ${
              isSubmitting 
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
            {isSubmitting ? '예약 중' : '예약하기'}
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
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
                  4자리 비밀번호를 입력해 주세요.
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleModalClose}
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
