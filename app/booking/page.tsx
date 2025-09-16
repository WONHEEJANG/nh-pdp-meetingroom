'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { reservationService } from '@/lib/supabase'

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

  // URL에서 예약 데이터 가져오기
  const bookingData: BookingData = {
    room: searchParams.get('room') || '-',
    date: searchParams.get('date') || '-',
    time: searchParams.get('time') || '-'
  }

  // 컴포넌트 마운트 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
    try {
      console.log('예약 완료', {
        bookingData,
        formData: {
          reserverName,
          purpose: selectedPurposes,
          password
        }
      })
      
      // Save to Supabase
      const reservationData = {
        reserver_name: reserverName || '김농협',
        purpose: purpose || '팀 회의',
        room: bookingData.room,
        date: bookingData.date,
        time: bookingData.time,
        password: password
      }

      const savedReservation = await reservationService.createReservation(reservationData)
      console.log('✅ Reservation saved:', savedReservation)
      
      // Navigate to completion page with form data
      const params = new URLSearchParams({
        reserverName: reserverName || '김농협',
        purpose: purpose || '팀 회의', // 인풋필드의 실제 텍스트 사용
        room: bookingData.room,
        date: bookingData.date,
        time: bookingData.time
      })

      router.push(`/completion?${params.toString()}`)
    } catch (error) {
      console.error('❌ Error saving reservation:', error)
      alert('예약 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
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

            {/* 시간 */}
            <div className="flex items-center justify-between">
              <span 
                className="text-[#505050]"
                style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                시간
              </span>
              <span 
                className="text-[#121212] text-right"
                style={{ 
                  fontFamily: 'Pretendard', 
                  fontWeight: 500, 
                  fontSize: '15px', 
                  letterSpacing: '-0.3px', 
                  lineHeight: '20px',
                  width: '80%',
                  wordBreak: 'normal'
                }}
              >
                {bookingData.time}
              </span>
            </div>
          </div>
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
            예약하기
          </button>
        </div>
      </div>
    </div>
  )
}
