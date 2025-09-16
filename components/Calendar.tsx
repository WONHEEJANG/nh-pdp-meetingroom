'use client'

import React, { useState } from 'react'

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelect?: (date: Date) => void
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1)) // 2025년 9월
  const today = new Date()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // 이전 달의 마지막 날들
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isWeekend: false
      })
    }

    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
      const isWeekend = date.getDay() === 0 || date.getDay() === 6

      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isWeekend
      })
    }

    // 다음 달의 첫 날들
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isWeekend: false
      })
    }

    return days
  }

  const handleDateClick = (day: any) => {
    if (day.isCurrentMonth && onDateSelect) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day.date)
      onDateSelect(date)
    }
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    if (onDateSelect) {
      onDateSelect(today)
    }
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="w-full bg-white" style={{ height: '332px' }}>
      {/* Controls */}
      <div className="flex items-center justify-between" style={{ height: '60px', paddingTop: '15px', paddingBottom: '15px' }}>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 bg-white border border-[#d3d3d3] rounded-lg text-[#121212] touch-manipulation flex items-center justify-center"
          style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '13px', letterSpacing: '-0.26px', lineHeight: '20px', height: '30px' }}
        >
          오늘
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => changeMonth('prev')}
            className="touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M15 18L9 12L15 6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span 
            className="text-[#121212] px-2"
            style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '25px', letterSpacing: '0px', lineHeight: '29.83px' }}
          >
            {currentMonth.getFullYear()}. {currentMonth.getMonth() + 1}
          </span>
          <button 
            onClick={() => changeMonth('next')}
            className="touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M9 18L15 12L9 6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="w-[47px] h-[30px]"></div>
      </div>

      {/* Week Days */}
      <div className="flex" style={{ height: '18px' }}>
        {weekDays.map((day, index) => (
          <div key={day} className="flex-1 flex items-center justify-center" style={{ height: '18px' }}>
            <span 
              className={`font-medium ${
                index === 0 ? 'text-[#ec0c0c]' : 
                index === 6 ? 'text-[#2c6dd4]' : 
                'text-[#767676]'
              }`}
              style={{ fontFamily: 'Pretendard', fontWeight: 500, fontSize: '13px', letterSpacing: '0px', lineHeight: '15.51px' }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ height: '226px', paddingTop: '12px', paddingBottom: '12px' }}>
        <div className="grid grid-cols-7 gap-0" style={{ height: '202px' }}>
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`flex-1 max-w-[36px] mx-auto rounded-2xl flex items-center justify-center touch-manipulation ${
                day.isSelected
                  ? 'bg-[#121212] text-white font-semibold'
                  : day.isCurrentMonth
                  ? 'text-[#121212] hover:bg-gray-100 active:bg-gray-200'
                  : 'text-[#929292]'
              }`}
              style={{ fontFamily: 'Pretendard', fontWeight: 400, fontSize: '16px', letterSpacing: '0px', lineHeight: '19.09px', width: '36px', height: '36px' }}
            >
              {day.date}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
