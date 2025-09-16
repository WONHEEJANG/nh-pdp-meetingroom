'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface CompletionData {
  reserverName: string
  purpose: string
  room: string
  date: string
  time: string
}

const CompletionPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const completionData: CompletionData = {
    reserverName: searchParams.get('reserverName') || '-',
    purpose: searchParams.get('purpose') || '-',
    room: searchParams.get('room') || '-',
    date: searchParams.get('date') || '-',
    time: searchParams.get('time') || '-'
  }

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Prevent back button on Android
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent default back behavior
      event.preventDefault()
      // Push current state to prevent back navigation
      window.history.pushState(null, '', window.location.href)
    }

    // Add event listener
    window.addEventListener('popstate', handlePopState)
    
    // Push initial state to prevent back navigation
    window.history.pushState(null, '', window.location.href)

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleShare = () => {
    console.log('공유하기')
    // Here you would implement sharing functionality
  }

  const handleConfirm = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white w-full max-w-md mx-auto px-6 pt-[50px] pb-32">
      {/* Header */}
      <div className="w-full bg-white flex items-center justify-center fixed top-0 left-0 right-0 z-10" style={{ height: '50px' }}>
        <h1 className="text-base font-semibold text-[#121212] leading-6 tracking-[-0.32px]" style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px' }}>
          회의실 예약
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Completion Image */}
        <div className="mb-8" style={{ marginTop: '24px' }}>
          <div className="w-[140px] h-[140px] flex items-center justify-center">
            <img 
              src="/img/common/img_complete-clap_140.png" 
              alt="예약 완료" 
              className="w-[140px] h-[140px]"
            />
          </div>
        </div>

        {/* Completion Message */}
        <div className="mb-8 w-full">
          <h2
            className="text-[#121212] text-left"
            style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '26px', letterSpacing: '-0.52px', lineHeight: '38px' }}
          >
            <span className="text-[#19973c]">{completionData.room}</span>을 예약했어요
          </h2>
        </div>

        {/* Booking Summary */}
        <div className="w-full bg-[#f6f6f6] rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            {/* 신청자 */}
            <div className="flex items-center justify-between">
              <span
                className="text-[#505050]"
                style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                신청자
              </span>
              <span
                className="text-[#121212]"
                style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {completionData.reserverName}
              </span>
            </div>

            {/* 사용 목적 */}
            <div className="flex items-center justify-between">
              <span
                className="text-[#505050]"
                style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                사용 목적
              </span>
              <span
                className="text-[#121212]"
                style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {completionData.purpose}
              </span>
            </div>

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
                {completionData.room}
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
                {completionData.date}
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
                className="text-[#121212]"
                style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {completionData.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons - Fixed at bottom */}
      <div className="w-full bg-white fixed bottom-0 left-0 right-0 z-10">
        <div className="w-full bg-gradient-to-r from-white to-transparent" style={{ height: '18px' }}></div>
        <div className="w-full bg-gradient-to-b from-white to-transparent flex items-center justify-center py-6 px-6">
          <div className="flex gap-3 w-full">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="bg-white border border-[#d3d3d3] rounded-xl text-[#121212] hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: 500,
                fontSize: '18px',
                letterSpacing: '-0.36px',
                lineHeight: '26px',
                height: '56px',
                width: '100px'
              }}
            >
              공유하기
            </button>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#19973c] text-white rounded-xl transition-colors touch-manipulation hover:bg-[#15803d] active:bg-[#137a35]"
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
    </div>
  )
}

export default CompletionPage
