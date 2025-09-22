'use client'

import React from 'react'

interface HeaderProps {
  onBack?: () => void
  onHome?: () => void
  onMenu?: () => void
  title?: string
}

const Header: React.FC<HeaderProps> = ({ onBack, onHome, onMenu, title }) => {
  return (
    <div className={`w-full bg-white flex items-center px-6 fixed top-0 left-0 right-0 z-10 ${onBack ? 'justify-between' : 'justify-center'}`} style={{ height: '50px' }}>
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      
      {/* Title */}
      <h1 className="text-base font-semibold text-[#121212] leading-6 tracking-[-0.32px]" style={{ fontFamily: 'Pretendard', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.32px', lineHeight: '24px' }}>
        {title || (onBack ? '예약 취소' : '회의실 예약')}
      </h1>
      
      {/* Right Side Spacer - only show when there's a back button */}
      {onBack && <div className="w-6 h-6"></div>}
    </div>
  )
}

export default Header
