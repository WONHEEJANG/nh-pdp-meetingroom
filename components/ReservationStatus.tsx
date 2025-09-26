'use client'

import React from 'react'
import { Reservation } from '@/lib/supabase'

interface ReservationStatusProps {
  reservations: Reservation[]
  selectedDate: Date | null
  selectedRoom: number
  loading: boolean
}

const ReservationStatus: React.FC<ReservationStatusProps> = ({ 
  reservations, 
  selectedDate, 
  selectedRoom, 
  loading 
}) => {
  // 선택된 날짜와 회의실에 해당하는 예약들 필터링
  const filteredReservations = reservations.filter(reservation => {
    if (!selectedDate) return false
    
    const roomName = `회의실 ${selectedRoom}`
    const dateStr = `${selectedDate.getFullYear()}. ${selectedDate.getMonth() + 1}. ${selectedDate.getDate()}.`
    
    return reservation.room === roomName && reservation.date === dateStr
  })

  // 시간을 30분 단위로 파싱하여 개별 슬롯으로 변환
  const parseTimeSlots = (timeRange: string, reserverName: string, purpose: string) => {
    const slots: { time: string, reserver: string, purpose: string }[] = []
    
    const ranges = timeRange.split(',').map(range => range.trim())
    
    ranges.forEach(range => {
      const [start, end] = range.split(/[-~]/).map(t => t.trim())
      if (start && end) {
        const startMinutes = timeToMinutes(start)
        const endMinutes = timeToMinutes(end)
        
        // 30분 단위로 슬롯 생성
        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
          slots.push({
            time: `${minutesToTime(minutes)}~${minutesToTime(minutes + 30)}`,
            reserver: reserverName,
            purpose: purpose
          })
        }
      }
    })
    
    return slots
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // 예약 데이터를 30분 단위 슬롯으로 변환하고 시간순으로 정렬
  const reservationList = filteredReservations
    .flatMap(reservation => parseTimeSlots(reservation.time, reservation.reserver_name, reservation.purpose))
    .sort((a, b) => a.time.localeCompare(b.time))

  if (loading) {
    return (
      <div className="bg-white border border-[#e1e1e1] rounded-2xl p-6 mb-6">
        <div className="text-center text-[#767676]" style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px' }}>
          예약 정보를 불러오는 중...
        </div>
      </div>
    )
  }

  if (!selectedDate) {
    return (
      <div className="bg-white border border-[#e1e1e1] rounded-2xl p-6 mb-6">
        <div className="text-center text-[#767676]" style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px' }}>
          날짜를 선택해주세요
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e1e1e1] rounded-2xl p-6 mb-6">
      {/* 제목 */}
      <div className="mb-4">
        <span 
          className="text-[#121212]"
          style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px' }}
        >
          예약현황
        </span>
      </div>

      {/* 예약 목록 */}
      <div className="space-y-4">
        {reservationList.length === 0 ? (
          <div className="text-center text-[#767676] py-8" style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '14px' }}>
            예약된 시간이 없습니다
          </div>
        ) : (
          reservationList.map((reservation, index) => (
            <div key={index} className="flex items-center justify-between">
              <span 
                className="text-[#505050]"
                style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {reservation.time}
              </span>
              <span 
                className="text-[#121212] text-right"
                style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '15px', letterSpacing: '-0.3px', lineHeight: '20px' }}
              >
                {reservation.purpose} / {reservation.reserver}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReservationStatus
